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
#include <SensorWorker.hpp>
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

    ServerConfig config = ServerConfig(argv[1]);

    Socket *socket = Socket::getInstance(); // Socket

    // initComponents can not send event because socket is not connected
    // IO io = IO(config.getComponentsJSON("inputs"), config.getComponentsJSON("outputs"));
    // io.initComponents();

    try
    {
        socket->connectSocket("127.0.0.1", 10049);
        socket->sendData(config.getName().c_str()); // Identify the server after connection
        sleep(2);                                   // Wait for the server to identify
    }
    catch (Exception &e)
    {
        cerr << e.what() << endl;
        quit(1);
    }

    EventController *event = EventController::getInstance();
    event->setHostName(config.getName());
    std::thread eventThread(&EventController::listen, event);
    // eventThread.detach();

    IO io = IO(config.getComponentsJSON("inputs"), config.getComponentsJSON("outputs"));
    io.initComponents();

    while (1)
    {
        cout << "MAIN" << endl;
        sleep(10);
        event->sendEvent(event->createEvent("hello", "teste"));
    }

    return 0;
}