#pragma once

#include <string>
#include <thread>
#include <streambuf>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <netdb.h>
#include <unistd.h>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <semaphore.h>

#include "cJSON.h"
#include "Socket.hpp"
#include "IO.hpp"

class EventController
{
public:
    EventController(std::string hostName, IO *io);
    // static EventController *getInstance();
    void setHostName(std::string hostName);
    void listen();
    void handleEvent(const char *event);

    // NOTE: Returns a heap allocated string, you are required to free it after use.
    const char *createEvent(const char *type, const char *value);
    void sendEvent(const char *event);

private:
    Socket *socket_;
    IO *io_;
    const char *hostName_;
    // static EventController *inst_; // The one, single instance
    // EventController();
    // EventController(const EventController &);
    // EventController &operator=(const EventController &);
};
