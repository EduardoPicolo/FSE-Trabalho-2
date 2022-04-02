#include <EventController.hpp>
#include <Socket.hpp>
#include <cJSON.h>
#include <cJSON_Utils.h>

using namespace std;

EventController::EventController(std::string hostName, IO *io)
{
    socket_ = Socket::getInstance();
    io_ = io;
    hostName_ = hostName.c_str();
}

void EventController::listen()
{
    std::cout << "Listening for events..." << std::endl;
    while (1)
    {
        string data = socket_->readData();
        handleEvent(data.c_str());
    }
}

void EventController::handleEvent(const char *event)
{
    // std::cout << "Handle Event: " << event << std::endl;
    const cJSON *type = NULL;
    const cJSON *value = NULL;

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

    type = cJSON_GetObjectItemCaseSensitive(event_json, "type");
    value = cJSON_GetObjectItemCaseSensitive(event_json, "value");
    // if (cJSON_IsString(type) && (type->valuestring != NULL))
    // {
    //     cout << "Received event type: " << type->valuestring << endl;
    // }
    // if (cJSON_IsString(value) && (value->valuestring != NULL))
    // {
    //     cout << "Received event value: " << value->valuestring << endl;
    // }

    component component = io_->getComponent(type->valuestring);

    wiringPiSetup();
    component.gpio = io_->toWiringPiPin(component.gpio);
    pinMode(component.gpio, OUTPUT);
    if (std::string(value->valuestring) == "1")
    {
        cout << "Turning " << component.tag << " on...";
        digitalWrite(component.gpio, HIGH);
        cout << " ✓" << endl;
        std::string confirmMessage = component.tag + " Ligado";
        usleep(500000);
        sendEvent(createEvent("confirmacao", confirmMessage.c_str()));
    }
    else if (std::string(value->valuestring) == "0")
    {
        cout << "Turning " << component.tag << " off...";
        digitalWrite(component.gpio, LOW);
        cout << " ✓" << endl;
        std::string confirmMessage = component.tag + " Desligado";
        usleep(500000);
        sendEvent(createEvent("confirmacao", confirmMessage.c_str()));
    }
    else
    {
        cout << "Invalid value: " << value->valuestring << endl;
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
    socket_->sendData(event);
}

void EventController::setHostName(std::string hostName)
{
    hostName_ = hostName.c_str();
}