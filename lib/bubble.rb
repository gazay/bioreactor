@last_message = nil

def get_bubble
  @last_message = Twitter::Search('#bioreactor').fetch.results[0]
  @last_message = @last_message.from_user + ': ' + @last_message.text
  @last_message
end