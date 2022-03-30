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

class EventController
{
public:
    EventController();
    void listen();
    void handleEvent(const char *event);
    const char *createEvent(const char *from, const char *type, const char *value);
    void sendEvent(const char *event);

private:
};
