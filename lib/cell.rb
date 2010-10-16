class Cell
  attr_accessor :x, :y, :content

  def initialize(x, y)
    @x = x
    @y = y
  end

  def location
    [@x, @y]
  end

  def next(direction)
    speed = 2
    case direction
    when 1
      then
      cell = Map.cell(x, y - speed)
    when 2
      then
      cell = Map.cell(x + speed, y)
    when 3
      then
      cell = Map.cell(x, y + speed)
    when 4
      then
      cell = Map.cell(x - speed, y)
    end
    cell
  end
end