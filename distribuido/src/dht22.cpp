#include <dht22.hpp>

int data[5] = {0, 0, 0, 0, 0};
float temp_cels = -1;
float temp_fahr = -1;
float humidity = -1;

DHT22_data read_dht_data(uint8_t dht_pin)
{
    /* reading raw dht22 data*/

    uint8_t laststate = HIGH;
    uint8_t counter = 0;
    uint8_t j = 0;
    uint8_t i;

    data[0] = data[1] = data[2] = data[3] = data[4] = 0;

    /* pull pin down for 18 milliseconds */
    pinMode(dht_pin, OUTPUT);
    digitalWrite(dht_pin, LOW);
    delay(18);

    /* prepare to read the pin */
    pinMode(dht_pin, INPUT);

    /* detect change and read data */
    for (i = 0; i < MAX_TIMINGS; i++)
    {
        counter = 0;
        while (digitalRead(dht_pin) == laststate)
        {
            counter++;
            delayMicroseconds(1);
            if (counter == 255)
            {
                break;
            }
        }
        laststate = digitalRead(dht_pin);

        if (counter == 255)
            break;

        /* ignore first 3 transitions */
        if ((i >= 4) && (i % 2 == 0))
        {
            /* shove each bit into the storage bytes */
            data[j / 8] <<= 1;
            if (counter > 16)
                data[j / 8] |= 1;
            j++;
        }
    }

    /*
     * check we read 40 bits (8bit x 5 ) + verify checksum in the last byte
     * print it out if data is good
     */
    DHT22_data dht22_data;

    if ((j >= 40) && (data[4] == ((data[0] + data[1] + data[2] + data[3]) & 0xFF)))
    {
        float h = (float)((data[0] << 8) + data[1]) / 10;
        if (h > 100)
        {
            h = data[0]; // for DHT11
        }
        float c = (float)(((data[2] & 0x7F) << 8) + data[3]) / 10;
        if (c > 125)
        {
            c = data[2]; // for DHT11
        }
        if (data[2] & 0x80)
        {
            c = -c;
        }
        temp_cels = c;
        temp_fahr = c * 1.8f + 32;
        humidity = h;
        if (DEBUG)
            printf("read_dht_data() Humidity = %.1f %% Temperature = %.1f *C (%.1f *F)\n", humidity, temp_cels, temp_fahr);

        dht22_data.temperature = temp_cels;
        dht22_data.humidity = humidity;
        return dht22_data;
    }
    else
    {
        if (DEBUG)
            printf("read_dht_data() Data not good, skip\n");
        temp_cels = temp_fahr = humidity = -1;
        dht22_data.temperature = temp_cels;
        dht22_data.humidity = humidity;
        return dht22_data;
    }
}
