class Worm
  attr_accessor :speed, :last_cell
  attr_reader :id, :cells, :direction

  @@worms = {}

  def initialize(socket)
    @id = socket.object_id
    init_data
    @speed = 1
    @@worms[socket] = self
  end

  def init_data
    @cells = [ Map.get_random(self) ]
    @direction = rand(4) + 1
  end

  def move
    next_cell = @cells.first.next(direction)
    return unless next_cell
    if check_content next_cell
      next_cell.content = self
      @cells.unshift next_cell
      true
    end
  end

  def check_content(cell)
    case cell.content
      when NilClass
        @last_cell = @cells.pop
        @last_cell.content = nil
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
    if enemy.cells.first != cell
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
    if self.size > Wall.strenght
      Wall.destroy cell
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