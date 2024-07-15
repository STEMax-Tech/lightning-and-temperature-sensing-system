let analogValue = 0
let airHumi = 0
let senLight = 0
let airTemp = 0
let setLight = EEPROM.readw(100)
I2C_LCD1602.LcdInit(39)
let strip = neopixel.create(DigitalPin.P0, 8, NeoPixelMode.RGB)
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
    if (senLight < setLight) {
        pins.digitalWritePin(DigitalPin.P14, 1)
        strip.showColor(neopixel.colors(NeoPixelColors.Violet))
        basic.showIcon(IconNames.Asleep)
    } else {
        pins.digitalWritePin(DigitalPin.P14, 0)
        strip.clear()
        basic.showIcon(IconNames.Happy)
    }
})
basic.forever(function () {
    airTemp = Environment.dht11value(Environment.DHT11Type.DHT11_temperature_C, DigitalPin.P2)
    basic.pause(100)
    airHumi = Environment.dht11value(Environment.DHT11Type.DHT11_humidity, DigitalPin.P2)
    basic.pause(100)
})
basic.forever(function () {
    analogValue = 0
    for (let index = 0; index <= 9; index++) {
        index += pins.analogReadPin(AnalogPin.P1)
    }
    analogValue = analogValue / 10
    senLight = Math.round(pins.map(
    analogValue,
    0,
    1023,
    100,
    0
    ))
    basic.pause(100)
})
// button state
basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        setLight += -1
        if (senLight < 0) {
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
        if (senLight > 100) {
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
    if (input.logoIsPressed()) {
        while (input.logoIsPressed()) {
            basic.showIcon(IconNames.Yes)
        }
        EEPROM.writew(100, setLight)
        music.play(music.tonePlayable(880, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
    }
})
