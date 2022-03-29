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
        std::string data = socket2->readData();
        handleEvent(data.c_str());
    }
}

void EventController::handleEvent(const char *const event)
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

    key = cJSON_GetObjectItemCaseSensitive(event_json, "data");
    if (cJSON_IsString(key) && (key->valuestring != NULL))
    {
        printf("Checking monitor \"%s\"\n", key->valuestring);
    }
}