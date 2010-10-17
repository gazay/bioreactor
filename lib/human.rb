class Human
  attr_accessor :direction, :speed, :type

  @@humans = []

  def initialize(cell=nil)
    return if @@humans.size >= 20
    if cell
      @cell = cell
      @cell.content = self
    else
      @cell = Map.get_random self
    end
    @direction = rand(4) + 1
    @speed = 1
    @type = rand(3)
    @@humans << self
  end

  def move
    @direction = rand(4) + 1 if rand(3) == 0
    next_cell = @cell.next(@direction)

    if !next_cell or next_cell.content
      @direction = rand(4) + 1
      next_cell = @cell.next(@direction)
    end

    if next_cell && !next_cell.content
      @cell.content = nil
      @cell = next_cell
      @cell.content = self
    end
  end

  def data
    ["h#{self.object_id}", [@cell.location]]
  end

  def self.destroy(human)
    @@humans.delete(human)
    new
  end

  def self.all
    @@humans
  end
end