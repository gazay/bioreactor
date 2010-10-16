module Map
  extend self

  attr_reader :width, :height

  @width = 70
  @height = 50
  @map = Array.new(@width) { |x| Array.new(@height) { |y| Cell.new x, y }}

  def generate
    #TODO: when we will do some walls - don't forget this method
  end

  def cell((x,y0), y1=nil)
    y = y0 || y1
    if x < @width and y < @height and x >= 0 and y >= 0
      @map[x][y]
    end
  end

  def get_random
    cell = self.cell rand(@width), rand(@height)
    cell.content.nil? ? cell : get_random
  end

  def get_wall(lenght)
    wall = []
    cell = get_random
    wall << cell
    (lenght - 1).times do
      cell = cell.next(rand(4) + 1) while (cell != nil) and cell.content.nil?
      wall << cell
    end
    wall
  end

  def data
    Hash[*Worm.all.map { |it| it.data }.flatten(1)]
  end
end