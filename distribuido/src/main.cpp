#include <stdio.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <vector>
#include <iostream>
#include <thread>
#include <chrono>
#include <csignal>

#include "../inc/cJSON.h"
#include <Socket.hpp>
#include <IO.hpp>
#include "Exception.hpp"
#include "EventController.hpp"
#include "ServerConfig.hpp"
#include <ComponentsWorker.hpp>
#include "wiringPi.h"

using namespace std;

void quit(int signum)
{
    cout << "Terminating..." << endl;
    Socket::getInstance()->closeConnection();
    exit(0);
}

int main(int argc, char const *argv[])
{

    signal(SIGINT, quit);

    if (argc < 2)
    {
        std::cout << "O arquivo de inicializacao precisa ser passado como parametro" << std::endl;
        exit(1);
    }

    wiringPiSetupGpio();

    ServerConfig config = ServerConfig(argv[1]);
    Socket *socket = Socket::getInstance(); // Socket
    IO io = IO(config.getComponentsJSON("inputs"), config.getComponentsJSON("outputs"));
    EventController eventController = EventController(config.getName(), &io);

    component dth = config.getComponentsJSON("sensor_temperatura")[0];
    ComponentsWorker worker = ComponentsWorker(&io, &eventController, dth);

    try
    {
        socket->connectSocket(config.getAddress().ip.c_str(), config.getAddress().port);
        socket->sendData(eventController.createEvent("identity", config.getName().c_str())); // Identify the server after connection
        usleep(500000);                                                                      // Wait for the server to identify
    }
    catch (Exception &e)
    {
        cerr << e.what() << endl;
        quit(1);
    }

    std::thread eventThread(&EventController::listen, eventController);

    worker.start();

    std::thread dht22Thread(&ComponentsWorker::DHT22Worker, worker);

    eventThread.join();
    dht22Thread.join();

    return 0;
}