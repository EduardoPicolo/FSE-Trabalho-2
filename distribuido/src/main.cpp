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

using namespace std;

void handle_sigint(int signum)
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
    signal(SIGINT, handle_sigint);

    cout << "You have entered " << argc
         << " arguments:"
         << "\n";

    for (int i = 0; i < argc; ++i)
        cout << argv[i] << "\n";

    Singleton *sock = Singleton::getInstance();

    try
    {
        sock->connectSocket("127.0.0.1", "8080");
        // string teste = create_event("teste", "teste2", "teste3");
        // cout << teste << endl;
        sock->sendData(create_event(argv[1], "", ""));
    }
    catch (Exception &e)
    {
        cerr << e.what() << endl;
        cout << "Retrying connection..." << endl;
        exit(1);
    }

    // char *teste = create_monitor_with_helpers();

    EventController eventController = EventController();

    std::thread eventThread(&EventController::listen, eventController);
    // eventThread.detach();

    while (1)
    {
        cout << "MAIN" << endl;
        sleep(5);
    }

    // free(teste);

    return 0;
}