class Wall
  @@walls = []

  def initialize()
    @cells = Map.get_wall
    @@walls << self
  end

  def destroy((x,y0), y1=nil)
    y = y0 || y1
    map.cell(x,y).content = nil
  end

  def data
    ['w'] + @cells.map { |it| it.location }
  end

  #class methods

  def self.all
    @@wals.values
  end
end