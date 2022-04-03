#include "ServerConfig.hpp"

using namespace std;

void ServerConfig::getNameJSON(cJSON *config_json)
{
    cJSON *name_json = cJSON_GetObjectItemCaseSensitive(config_json, "nome");
    name_ = name_json->valuestring;
}

void ServerConfig::getAddressJSON(cJSON *config_json)
{
    cJSON *ip_json = cJSON_GetObjectItemCaseSensitive(config_json, "ip_servidor_central");
    cJSON *port_json = cJSON_GetObjectItemCaseSensitive(config_json, "porta_servidor_central");

    address_.ip = ip_json->valuestring;
    address_.port = port_json->valueint;
}

std::vector<component> ServerConfig::getComponentsJSON(std::string componentType)
{
    std::vector<component> components;

    cJSON *component_json = cJSON_GetObjectItem(config_, componentType.c_str());

    for (int i = 0; i < cJSON_GetArraySize(component_json); i++)
    {
        cJSON *data = cJSON_GetArrayItem(component_json, i);
        struct component tempComponent;
        tempComponent.type = cJSON_GetObjectItem(data, "type")->valuestring;

        std::string tag = cJSON_GetObjectItem(data, "tag")->valuestring;
        if (tempComponent.type == "janela")
        {
            int pos = tag.find_last_of(' ');
            tempComponent.type += ' ' + tag.substr(pos + 2, tag.length());
        }
        else if (tempComponent.type == "lampada")
        {
            int pos = tag.find_last_of(' ');
            std::string type = tag.substr(pos + 2, tag.length());
            if (type.find("0") == std::string::npos)
            {
                tempComponent.type += " 03";
            }
            else
            {
                tempComponent.type += ' ' + type;
            }
        }

        tempComponent.tag = tag;
        tempComponent.gpio = cJSON_GetObjectItem(data, "gpio")->valueint;
        tempComponent.state = 0;

        components.push_back(tempComponent);
    }

    return components;
}

ServerConfig::ServerConfig(const char *path)
{
    std::ifstream fs;
    fs.open(path);

    if (fs.is_open())
    {
        std::stringstream buffer;
        buffer << fs.rdbuf();

        cJSON *config_json = cJSON_Parse(buffer.str().c_str());
        config_ = config_json;

        getNameJSON(config_json);
        getAddressJSON(config_json);

        cout << "Config file loaded" << endl;
    }
    else
    {
        cout << "Failed to open config file: " << path << endl;
        exit(0);
    }

    fs.close();
}

std::string ServerConfig::getName()
{
    return name_;
}

address ServerConfig::getAddress()
{
    return address_;
}

ServerConfig::~ServerConfig()
{
}