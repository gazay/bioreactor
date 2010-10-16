class Human
  attr_accessor :direction, :speed, :type
  
  @@humans = []
  
  def initialize()
    @cell = [Map.get_random]
    @direction = rand(4) + 1
    @speed = 1
    @type = rand(3)
    @@humans << self
  end
  
  def move
    next_cell = @cell.next(direction)
    do next_cell = @cell.next(rand(4) + 1) while next_cell
    next_cell.content = self
    @cell.content = nil
    true
  end
  
  def data
    ['h', cell.location]
  end
  
  def self.all
    @@humans
  end
  
  def check_availability(cell)
    #TODO: when we create walls - use this method, or create in Cell
  end
end