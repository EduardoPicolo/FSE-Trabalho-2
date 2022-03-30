#include <EventController.hpp>
#include <Socket.hpp>
#include <cJSON.h>
#include <cJSON_Utils.h>

using namespace std;

EventController::EventController() {}

void EventController::listen()
{
    Singleton *socket2 = Singleton::getInstance();

    while (1)
    {
        string data = socket2->readData();
        handleEvent(data.c_str());
    }
}

void EventController::handleEvent(const char *event)
{
    // std::cout << "Handle Event: " << event << std::endl;
    const cJSON *key = NULL;

    cJSON *event_json = cJSON_Parse(event);
    if (event_json == NULL)
    {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL)
        {
            fprintf(stderr, "JSON Error before: %s\n", error_ptr);
            return;
        }
        cJSON_Delete(event_json);
    }

    key = cJSON_GetObjectItemCaseSensitive(event_json, "type");
    if (cJSON_IsString(key) && (key->valuestring != NULL))
    {
        cout << "Received event: " << key->valuestring << endl;
    }
}

const char *EventController::createEvent(const char *from, const char *type, const char *value)
{
    cJSON *payload = cJSON_CreateObject();

    if (cJSON_AddStringToObject(payload, "from", from) == NULL)
    {
        cJSON_Delete(payload);
        exit(1);
    }
    if (cJSON_AddStringToObject(payload, "type", type) == NULL)
    {
        cJSON_Delete(payload);
        exit(1);
    }
    if (cJSON_AddStringToObject(payload, "value", value) == NULL)
    {
        cJSON_Delete(payload);
        exit(1);
    }

    char *event = NULL;
    event = cJSON_Print(payload);
    if (event == NULL)
    {
        fprintf(stderr, "Failed to create event payload.\n");
    }

    return event;
}

void EventController::sendEvent(const char *event)
{
    Singleton *socket = Singleton::getInstance();
    socket->sendData(event);
}