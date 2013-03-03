#! /usr/bin/ruby

require 'rubygems'
require "bundler/setup"

require 'eventmachine'
require 'em-websocket'
require 'sinatra/base'
require 'thin'
require 'json'

@sockets = []

class Server < Sinatra::Base
  configure do
    enable :logging

    set :root, File.dirname(__FILE__)
    set :public_folder, Proc.new { File.join(root, "assets") }
  end

  get '/' do
    send_file 'index.html'
  end

  get '/m' do
    send_file 'mobile.html'
  end
end
  
EventMachine.run do
  EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 8080) do |socket|
    socket.onopen do
      @sockets << socket
      @sockets.each{ |s| s.send( { :type => :Connect, :data => "#{@sockets.size} clients connected"}.to_json ) }
    end

    socket.onmessage do |mess|
      puts "message: #{mess}"
      @sockets.each{ |s| next if s == socket; s.send( { :type => :Message, :data => mess }.to_json ) }
    end
    socket.onclose do
      @sockets.delete socket
      @sockets.each{ |s| s.send( { :type => :Connect, :data => "#{@sockets.size} clients connected"}.to_json ) }
    end
  end

  puts ">> WebSocket server"
  puts ">> Listening on 0.0.0.0:8080"

  Thin::Server.start Server, '0.0.0.0', 4000
end

