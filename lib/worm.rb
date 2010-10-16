class Worm
  attr_accessor :direction, :speed, :last_cell
  attr_reader :id
  
  def initialize(id)
    @id = id
    @cells = [Map.get_random]
    @direction = rand(4) + 1
    @speed = 1
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
  
  def check_availability(cell)
    #TODO: when we create walls - use this method, or create in Cell
  end
end