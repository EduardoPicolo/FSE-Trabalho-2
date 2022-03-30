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
#include "Exception.hpp"
#include "EventController.hpp"
#include "ServerConfig.hpp"
#include "wiringPi.h"

using namespace std;

void quit(int signum)
{
    cout << "Terminating..." << endl;
    Singleton::getInstance()->closeConnection();
    exit(0);
}

// NOTE: Returns a heap allocated string, you are required to free it after use.
char *create_event(const char *name, const char *type, const char *value)
{
    char *string = NULL;
    size_t index = 0;
    cJSON *payload = cJSON_CreateObject();

    if (cJSON_AddStringToObject(payload, "name", name) == NULL)
    {
        cJSON_Delete(payload);
        return string;
    }
    if (cJSON_AddStringToObject(payload, "type", type) == NULL)
    {
        cJSON_Delete(payload);
        return string;
    }
    if (cJSON_AddStringToObject(payload, "value", value) == NULL)
    {
        cJSON_Delete(payload);
        return string;
    }

    string = cJSON_Print(payload);
    if (string == NULL)
    {
        fprintf(stderr, "Failed to print monitor.\n");
    }

    return string;
}

int main(int argc, char const *argv[])
{
    signal(SIGINT, quit);

    IO *io;
    ServerConfig config = ServerConfig(argv[1], io);
    Singleton *socket = Singleton::getInstance(); // Socket
    EventController event = EventController();

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
    }
    catch (Exception &e)
    {
        cerr << e.what() << endl;
        quit(1);
    }

    std::thread eventThread(&EventController::listen, event);
    // eventThread.detach();

    while (1)
    {
        cout << "MAIN" << endl;
        sleep(5);
        event.sendEvent(event.createEvent(config.getName().c_str(), "hello", "teste"));
    }

    // free(teste);
    delete io;

    return 0;
}