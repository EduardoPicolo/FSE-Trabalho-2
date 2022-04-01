#include <EventController.hpp>
#include <Socket.hpp>
#include <cJSON.h>
#include <cJSON_Utils.h>

using namespace std;

EventController::EventController()
{
    socket_ = Socket::getInstance();
}

// Define the static Socket pointer
EventController *EventController::inst_ = NULL;

EventController *EventController::getInstance()
{
    if (inst_ == NULL)
    {
        inst_ = new EventController();
    }
    return (inst_);
}

void EventController::listen()
{
    while (1)
    {
        string data = socket_->readData();
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

const char *EventController::createEvent(const char *type, const char *value)
{
    cJSON *payload = cJSON_CreateObject();

    if (cJSON_AddStringToObject(payload, "from", hostName_) == NULL)
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

    cJSON_Delete(payload);
    // std::cout << "Event: " << event << std::endl;
    return event;
}

void EventController::sendEvent(const char *event)
{
    // Socket *socket = Socket::getInstance();
    socket_->sendData(event);
}

void EventController::setHostName(std::string hostName)
{
    hostName_ = hostName.c_str();
}