#include <EventController.hpp>
#include <Socket.hpp>
#include <sstream>
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

    bool state = std::string(value->valuestring) == "1";

    if (std::string(type->valuestring) == "ligaTodos")
    {
        for (component component : io_->getOutputs())
        {
            pinMode(component.gpio, OUTPUT);
            digitalWrite(component.gpio, state ? HIGH : LOW);
            sendEvent(createEvent(component.type.c_str(), std::string(value->valuestring).c_str()));
            delay(200);
        }
        std::string msg = state ? "ligados" : "desligados";
        std::stringstream ss;
        ss << "Todos os dispositivos foram " << msg << endl;
        sendEvent(createEvent("confirmacao", ss.str().c_str()));
        return;
    }

    component component;
    if (std::string(type->valuestring) == "aspersor")
    {
        component.type = "aspersor";
        component.tag = "Aspersor de Água (Incêndio)";
        component.gpio = 16;
        component.state = 0;
    }
    else
    {
        component = io_->getComponent(type->valuestring);
    }
    pinMode(component.gpio, OUTPUT);
    if (state)
    {
        cout << "Turning " << component.tag << " on...";
        digitalWrite(component.gpio, HIGH);
        cout << " ✓" << endl;
        std::string confirmMessage = component.tag + " Ligado";
        // usleep(500000);
        sendEvent(createEvent("confirmacao", confirmMessage.c_str()));
    }
    else if (!state)
    {
        cout << "Turning " << component.tag << " off...";
        digitalWrite(component.gpio, LOW);
        cout << " ✓" << endl;
        std::string confirmMessage = component.tag + " Desligado";
        // usleep(500000);
        sendEvent(createEvent("confirmacao", confirmMessage.c_str()));
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