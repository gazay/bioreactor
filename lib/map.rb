module Map
  extend self
  width = 70
  height = 50
  @map = Array.new(width) { |x| Array.new(height) { |y| Cell.new x, y }}

  def generate
    #TODO: when we will do some walls - don't forget this method
  end

  def cell((x,y0), y1=nil)
    y = y0 || y1
    if x < width and y < height and x >= 0 and y >= 0
      @map[x][y]
    end
  end

  def get_random
    cell = @map.cell rand(width), rand(height)
    cell.content.nil? ? cell : get_random
  end
end