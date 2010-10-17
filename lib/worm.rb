class Worm
  attr_accessor :direction, :speed, :last_cell
  attr_reader :id, :cells

  @@worms = {}

  def initialize(socket)
    @id = socket.object_id
    @cells = Array.new(rand(5) + 1){ Map.get_random(self) }
    @direction = rand(4) + 1
    @speed = 1
    @@worms[socket] = self
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
    elsif (direction - enemy.direction).abs == 2
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
    @cells = [Map.get_random(self)]
    @direction = rand(4) + 1
    false
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