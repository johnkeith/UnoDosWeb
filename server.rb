require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/flash'
require 'haml'

# require all of the models and view templates
Dir['app/**/*.rb'].each { |file| require_relative file }

enable :sessions

# set views directory to app/views
set :views, 'app/views'

get '/' do
  haml :instructions
end

get '/game' do
  @address_in_memory = Token.order("RANDOM()").first.token
  session[:address_in_memory] = @address_in_memory
  haml :game
end

post '/game' do
  if params[:player_name] != "" && params[:address_in_memory] != nil && params[:address_in_memory] == session[:address_in_memory]
    Score.create(player_name: params[:player_name], score: params[:score])
  end
  redirect '/highscores'
end

post '/token' do
end

get '/highscores' do
  @scores = Score.order("score DESC")
  haml :highscores
end
