class Worm
  attr_accessor :direction, :speed, :last_cell
  attr_reader :id
  
  @@worms = {}
  
  def initialize(id)
    @id = id
    @cells = [Map.get_random]
    @direction = rand(4) + 1
    @speed = 1
    @@worms[id] = self
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
  
  def destroy
    @cells.each do |cell|
      cell.content = nil
    end
  end
  
  def data
    [id] + @cells.map { |it| it.location }
  end
  #class methods
  
  def self.destroy(worm_id)
    @@worms[worm_id].destroy
    @@worms.delete worm_id
  end
  
  def self.find(worm_id)
    @@worms[worm_id]
  end
  
  def self.all
    @@worms
  end
  #not realized methods yet
  
  def check_availability(cell)
    #TODO: when we create walls - use this method, or create in Cell
  end
end