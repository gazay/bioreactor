class Worm
  attr_accessor :direction, :speed, :last_cell
  attr_reader :id

  @@worms = {}

  def initialize(socket)
    @id = socket.object_id
    @cells = [Map.get_random]
    @direction = rand(4) + 1
    @speed = 1
    @@worms[socket] = self
  end

  def move
    next_cell = @cells.first.next(direction)
    return unless next_cell
    next_cell.content = self
    @cells.unshift next_cell
    @last_cell = @cells.pop
    @last_cell.content = nil
    true
  end

  def grow
    @last_cell.content = self
  end

  def cut(cell)
    if @cells.find_index(cell) == 0
      cell.content = nil
      return nil
    end
    cutted = @cells.pop(@cells.size - @cells.find_index(cell))
    cutted.each do |c|
      c.content = nil
    end
  end

  def destroy
    @cells.each do |cell|
      cell.content = nil
    end
  end

  def data
    [id] + @cells.map { |it| it.location }
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

  #not realized methods yet

  def check_availability(cell)
    #TODO: when we create walls - use this method, or create in Cell
  end
end