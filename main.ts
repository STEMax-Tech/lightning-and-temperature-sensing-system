let airHumi = 0
let senLight = 0
let airTemp = 0
let setLight = EEPROM.readw(100)
I2C_LCD1602.LcdInit(33)
basic.forever(function () {
    serial.writeLine("Air Temp: " + airTemp + " C")
    serial.writeLine("Air Humi: " + airTemp + " %")
    serial.writeLine("Light: " + senLight + " %")
    I2C_LCD1602.ShowString("Te:" + Math.round(airTemp) + "C  ", 0, 0)
    I2C_LCD1602.ShowString("Hu:" + airHumi + "%  ", 9, 0)
    I2C_LCD1602.ShowString("Li:" + senLight + "%  ", 0, 1)
    I2C_LCD1602.ShowString("SLi:" + setLight + "   ", 9, 1)
    basic.pause(100)
})
basic.forever(function () {
    if (senLight <= setLight) {
        pins.digitalWritePin(DigitalPin.P14, 1)
        pins.digitalWritePin(DigitalPin.P15, 1)
        basic.showIcon(IconNames.Asleep)
    } else {
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 0)
        basic.showIcon(IconNames.Happy)
    }
})
basic.forever(function () {
    airTemp = Environment.dht11value(Environment.DHT11Type.DHT11_temperature_C, DigitalPin.P2)
    basic.pause(500)
    airHumi = Environment.dht11value(Environment.DHT11Type.DHT11_humidity, DigitalPin.P2)
    basic.pause(500)
})
// button state
basic.forever(function () {
    if (input.buttonIsPressed(Button.AB)) {
        while (input.buttonIsPressed(Button.AB)) {
            basic.showIcon(IconNames.Yes)
        }
        EEPROM.writew(100, setLight)
    } else if (input.buttonIsPressed(Button.A)) {
        setLight += -1
        if (setLight < 0) {
            setLight = 100
        }
        basic.showLeds(`
            . . . . .
            . . . . .
            . # # # .
            . . . . .
            . . . . .
            `)
    } else if (input.buttonIsPressed(Button.B)) {
        setLight += 1
        if (setLight > 100) {
            setLight = 0
        }
        basic.showLeds(`
            . . . . .
            . . # . .
            . # # # .
            . . # . .
            . . . . .
            `)
    }
})
basic.forever(function () {
    senLight = Math.round(pins.map(
    pins.analogReadPin(AnalogReadWritePin.P1),
    0,
    1023,
    0,
    100
    ))
    basic.pause(100)
})
