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
    Singleton::getInstance()->closeConnection();
    exit(0);
}

int main(int argc, char const *argv[])
{
    signal(SIGINT, quit);

    ServerConfig config = ServerConfig(argv[1]);

    Singleton *socket = Singleton::getInstance(); // Socket

    // initComponents can not send event because socket is not connected
    // IO io = IO(config.getComponentsJSON("inputs"), config.getComponentsJSON("outputs"));
    // io.initComponents();

    // while (1)
    // {
    //     sleep(10);
    // }

    // component aaa = io->getInputs()[0];
    // cout << "aaa.name: " << aaa.tag << endl;

    // wiringPiSetup();
    // wiringPiISR(23, INT_EDGE_RISING, aaaa);
    // wiringPiISR(24, INT_EDGE_RISING, bbbb);

    // while (1)
    // {
    //     int aaa = digitalRead(25);
    //     cout << "aaa: " << aaa << endl;
    //     delay(1000);
    // }

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
        sleep(7);
        event->sendEvent(event->createEvent("hello", "teste"));
    }

    // free(teste);
    // delete io;

    return 0;
}