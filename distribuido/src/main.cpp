// Client side C/C++ program to demonstrate Socket programming
#include <stdio.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <vector>

#include "../inc/cJSON.h"
#include <socket.hpp>
#define PORT 8080

int is_ready(int fd)
{
    fd_set fdset;
    struct timeval timeout;
    FD_ZERO(&fdset);
    FD_SET(fd, &fdset);

    timeout.tv_sec = 0;
    timeout.tv_usec = 1;

    return select(fd + 1, &fdset, NULL, NULL, &timeout) == 1;
}

// NOTE: Returns a heap allocated string, you are required to free it after use.
char *create_monitor_with_helpers(void)
{
    const unsigned int resolution_numbers[3][2] = {
        {1280, 720},
        {1920, 1080},
        {3840, 2160}};
    char *string = NULL;
    cJSON *resolutions = NULL;
    size_t index = 0;

    cJSON *monitor = cJSON_CreateObject();

    if (cJSON_AddStringToObject(monitor, "name", "Awesome 4K") == NULL)
    {
        goto end;
    }

    resolutions = cJSON_AddArrayToObject(monitor, "resolutions");
    if (resolutions == NULL)
    {
        goto end;
    }

    for (index = 0; index < (sizeof(resolution_numbers) / (2 * sizeof(int))); ++index)
    {
        cJSON *resolution = cJSON_CreateObject();

        if (cJSON_AddNumberToObject(resolution, "width", resolution_numbers[index][0]) == NULL)
        {
            goto end;
        }

        if (cJSON_AddNumberToObject(resolution, "height", resolution_numbers[index][1]) == NULL)
        {
            goto end;
        }

        cJSON_AddItemToArray(resolutions, resolution);
    }

    string = cJSON_Print(monitor);
    if (string == NULL)
    {
        fprintf(stderr, "Failed to print monitor.\n");
    }

end:
    cJSON_Delete(monitor);
    return string;
}

int main(int argc, char const *argv[])
{
    int sock = Singleton::Instance("127.0.0.1", "8080").getConnection();

    char *teste = create_monitor_with_helpers();
    int valread;
    char buffer[1024] = {0};

    while (1)
    {
        if (is_ready(sock))
        {
            valread = read(sock, buffer, 1024); // this is a blocking call
            std::string received = std::string(buffer, valread);
            std::cout << "RECEIVED: " << received << " - BYTES: " << valread << std::endl;
            send(sock, teste, strlen(teste), 0);
            // sleep(2);
        }
    }

    free(teste);

    return 0;
}