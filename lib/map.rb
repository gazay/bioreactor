module Map
  extend self

  attr_reader :width, :height

  @width = 70
  @height = 50
  @map = Array.new(@width) { |x| Array.new(@height) { |y| Cell.new x, y }}

  def cell((x,y0), y1=nil)
    y = y0 || y1
    if x < @width and y < @height and x >= 0 and y >= 0
      @map[x][y]
    end
  end

  def get_random(content)
    cell = self.cell rand(@width), rand(@height)
    if cell.content.nil?
      cell.content = content
      cell
    else
      get_random content
    end
  end

  def get_wall(lenght, content)
    wall = []
    cell = get_random content
    wall << cell
    (lenght - 1).times do
      cell = cell.next(rand(4) + 1) while (cell != nil) and cell.content.nil?
      cell.content = content
      wall << cell
    end
    wall
  end

  def data
    Hash[*Worm.all.map { |it| it.data }.flatten(1)]
  end

  def view
    @map.transpose.map {|it| it.map {|cell| cell.content ? 'P' : ' ' }.join }.join "\n"
  end
end