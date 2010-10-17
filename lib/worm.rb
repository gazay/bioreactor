class Worm
  attr_accessor :speed
  attr_reader :id, :cells, :direction

  @@worms = {}

  def initialize(socket)
    @id = socket.object_id
    init_data
    @speed = 1
    @@worms[socket] = self
    2.times do
      next_cell = @cells.first.next(direction)
      unshift next_cell if next_cell
    end
  end

  def init_data
    @cells = [ Map.get_random(self) ]
    @direction = rand(4) + 1
  end

  def move
    next_cell = @cells.first.next(direction)
    return unless next_cell
    unshift next_cell if check_content next_cell
  end

  def check_content(cell)
    case cell.content
    when Bioreactor
    self.respawn #Muahahahah
    when NilClass
      drop_last
      true
    when Human
      Human.destroy cell.content
      true
    when Worm then check_destiny(cell)
    when Wall then head_bang(cell)
    end
  end

  def check_destiny(cell)
    enemy = cell.content
    if enemy == self
      return false
    elsif enemy.cells.first != cell
      enemy.cut cell
    elsif reverse_direction? enemy.direction
      if self.size > enemy.size
        enemy.respawn
        return true
      end
      if self.size < enemy.size
        self.respawn
        return false
      end
      return false
    else
      enemy.respawn
    end
    true
  end

  def head_bang(cell)
    if self.size > Wall.strength
      Wall.destroy cell
      drop_last
      true
    else
      false
    end
  end

  def cut(cell)
    index = @cells.index(cell)
    if index == 0
      respawn
    else
      cutted = @cells.pop(@cells.size - index)
      cutted.each do |c|
        c.content = nil
        Human.new c
      end
    end
  end

  def respawn
    destroy
    init_data
  end

  def destroy
    @cells.each do |cell|
      cell.content = nil
    end
  end

  def unshift(cell)
    cell.content = self
    @cells.unshift cell
  end

  def data
    [id] << @cells.map { |it| it.location }
  end

  def size
    @cells.size
  end

  def reverse_direction?(other_direction)
    (direction - other_direction).abs == 2
  end

  def direction=(new_direction)
    @cells.reverse! if reverse_direction? new_direction
    @direction = new_direction
  end

  def drop_last
    @cells.pop.content = nil
  end

  #class methods

  def self.destroy(socket)
    @@worms[socket].destroy
    @@worms.delete socket
  end

  def self.find(socket)
    @@worms[socket]
  end

  def self.all
    @@worms.values
  end

  def self.sockets
    @@worms.keys
  end

  def self.storage
    @@worms
  end
end