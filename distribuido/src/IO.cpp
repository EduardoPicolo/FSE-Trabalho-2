#include "IO.hpp"
#include <string>

IO::IO(std::vector<component> inputs, std::vector<component> outputs)
{
    inputComponents_ = inputs;
    outputComponents_ = outputs;
}

std::vector<component> IO::getInputs()
{
    return inputComponents_;
}
std::vector<component> IO::getOutputs()
{
    return outputComponents_;
}

int IO::toWiringPiPin(int gpio)
{
    int pinToGpioR2[64] = {
        17, 18, 27, 22, 23, 24, 25, 4, // From the Original Wiki - GPIO 0 through 7:	wpi  0 -  7
        2, 3,                          // I2C  - SDA0, SCL0				wpi  8 -  9
        8, 7,                          // SPI  - CE1, CE0				wpi 10 - 11
        10, 9, 11,                     // SPI  - MOSI, MISO, SCLK			wpi 12 - 14
        14, 15,                        // UART - Tx, Rx				wpi 15 - 16
        28, 29, 30, 31,                // Rev 2: New GPIOs 8 though 11			wpi 17 - 20
        5, 6, 13, 19, 26,              // B+						wpi 21, 22, 23, 24, 25
        12, 16, 20, 21,                // B+						wpi 26, 27, 28, 29
        0, 1,                          // B+						wpi 30, 31
    };

    int index = 0;

    while (index < 64 && pinToGpioR2[index] != gpio)
        ++index;

    return (index == 64 ? -1 : index);
}

IO::~IO() {}
