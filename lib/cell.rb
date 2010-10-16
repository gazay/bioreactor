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
    case direction
    when 1
      then
      cell = Map.cell(x, y - 1)
    when 2
      then
      cell = Map.cell(x - 1, y)
    when 3
      then
      cell = Map.cell(x, y + 1)
    when 4
      then
      cell = Map.cell(x + 1, y)
    end
    cell
  end
end