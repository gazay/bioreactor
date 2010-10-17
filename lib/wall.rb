class Wall
  @@walls = []
  @@strength = 5

  def initialize(size)
    @@walls += Map.get_wall(size, self)
  end

  def self.data
    ['w'] << @@walls.map {|it| it.location}
  end

  def self.destroy(cell)
    @@walls.delete cell
  end

  def self.strength
    @@strength
  end
end