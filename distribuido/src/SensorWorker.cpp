#include "SensorWorker.hpp"

EventController *SensorWorker::event_ = nullptr;
int SensorWorker::presenceSensor_ = 0;
int SensorWorker::smokeSensor_ = 0;
int SensorWorker::window01_ = 0;
int SensorWorker::window02_ = 0;
int SensorWorker::totalPeople_ = 0;
int SensorWorker::peopleGroundFloor_ = 0;
int SensorWorker::peopleFirstFloor_ = 0;

SensorWorker::SensorWorker()
{
    event_ = EventController::getInstance();
}

void SensorWorker::initComponentWorker(component component)
{
    if (component.type == "presenca")
    {
        presenceSensor_ = component.state;
        wiringPiISR(component.gpio, INT_EDGE_BOTH, PresenceSensorHandler);
    }
    else if (component.type == "fumaca")
    {
        smokeSensor_ = component.state;
        wiringPiISR(component.gpio, INT_EDGE_BOTH, SmokeSensorHandler);
    }
    else if (component.type == "contagem")
    {
        // return CountEnterHandler;
        // wiringPiISR(23, INT_EDGE_BOTH, (void (*)())getComponentHandler("contagem"));
    }
    if (component.type == "janela")
    {
        int pos = component.tag.find_last_of(' ');
        std::string tag = component.tag.substr(pos + 2, component.tag.length());

        if (tag == "01")
        {
            window01_ = component.state;
            // std::cout << "janela 01 pin: " << component.gpio << std::endl;
            wiringPiISR(component.gpio, INT_EDGE_BOTH, Window01Handler);
        }
        else if (tag == "02")
        {
            window02_ = component.state;
            // std::cout << "janela 02 pin: " << component.gpio << std::endl;
            wiringPiISR(component.gpio, INT_EDGE_BOTH, Window02Handler);
        }
    }
}

SensorWorker::~SensorWorker() {}

void SensorWorker::Window01Handler()
{
    if (window01_ == 0)
    {
        window01_ = 1;
        std::cout << "Janela T01 aberta" << std::endl;
    }
    else if (window01_ == 1)
    {
        window01_ = 0;
        std::cout << "Janela T01 fechada" << std::endl;
    }

    std::string eventType = "janela 01";

    event_->sendEvent(event_->createEvent(eventType.c_str(), std::to_string(window01_).c_str()));
}

void SensorWorker::Window02Handler()
{
    if (window02_ == 0)
    {
        window02_ = 1;
        std::cout << "Janela 02 aberta" << std::endl;
    }
    else if (window02_ == 1)
    {
        window02_ = 0;
        std::cout << "Janela 02 fechada" << std::endl;
    }

    std::string eventType = "janela 02";

    event_->sendEvent(event_->createEvent(eventType.c_str(), std::to_string(window02_).c_str()));
}

void SensorWorker::PresenceSensorHandler()
{
    if (presenceSensor_ == 0)
    {
        presenceSensor_ = 1;
        std::cout << "Sensor de presença Ligado" << std::endl;
    }
    else if (presenceSensor_ == 1)
    {
        presenceSensor_ = 0;
        std::cout << "Sensor de preseça desligado" << std::endl;
    }
    event_->sendEvent(event_->createEvent("presenca", std::to_string(presenceSensor_).c_str()));
}

void SensorWorker::SmokeSensorHandler()
{
    if (smokeSensor_ == 0)
    {
        smokeSensor_ = 1;
        std::cout << "Sensor de fumaça Ligado" << std::endl;
    }
    else if (smokeSensor_ == 1)
    {
        smokeSensor_ = 0;
        std::cout << "Sensor de fumaça desligado" << std::endl;
    }
    event_->sendEvent(event_->createEvent("fumaca", std::to_string(smokeSensor_).c_str()));
}
// void CountEnterHandler() {}
// void CountExitHandler() {}
