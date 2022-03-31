#include "SensorWorker.hpp"
#include <string>

static int window1 = 0;

SensorWorker::SensorWorker()
{
}

auto SensorWorker::initComponentWorker(component component)
{
    if (component.type == "presenca")
    {
        std::cout << "presenca pin: " << component.gpio << std::endl;
        wiringPiISR(component.gpio, INT_EDGE_RISING, PresenceSensorHandler);
    }
    else if (component.type == "contagem")
    {
        // return CountEnterHandler;
        // wiringPiISR(23, INT_EDGE_RISING, (void (*)())getComponentHandler("contagem"));
    }
    if (component.type == "janela")
    {
        int pos = component.tag.find_last_of(' ');
        std::string tag = component.tag.substr(pos + 1, component.tag.length());

        if (tag == "T01")
        {

            std::cout << "janela T01 pin: " << component.gpio << std::endl;
            wiringPiISR(component.gpio, INT_EDGE_BOTH, []()
                        { std::cout << "Janela T01" << std::endl; });
        }
        else if (tag == "T02")
        {
            std::cout << "janela T02 pin: " << component.gpio << std::endl;
            wiringPiISR(component.gpio, INT_EDGE_BOTH, []()
                        { std::cout << "Janela T02" << std::endl; });
        }
    }
}

SensorWorker::~SensorWorker() {}
