# DTN job interview assignment

## Background

DTN creates, ingests, processes, and distributes a large amount of weather data.

A lot of people rely on this data to make critical life and business decisions. As a result, we need to process this data quickly and reliably.

It's imperative that our programs function correctly, self-correct when they can, and leave useful clues about what went wrong and how to fix it when they cannot recover.

## Task

Your task is to write a program that reads lightning events data as a stream from standard input (one lightning strike per line as a JSON object, and matches that data against a source of assets (also in JSON format) to produce an alert.

An example 'strike' coming off of the exchange looks like this:

```json
{
    "flashType": 1,
    "strikeTime": 1386285909025,
    "latitude": 33.5524951,
    "longitude": -94.5822016,
    "peakAmps": 15815,
    "reserved": "000",
    "icHeight": 8940,
    "receivedTime": 1386285919187,
    "numberOfSensors": 17,
    "multiplicity": 1
}
```

### Where:

- flashType=(0='cloud to ground', 1='cloud to cloud', 9='heartbeat')
- strikeTime=the number of milliseconds since January 1, 1970, 00:00:00 GMT

### Note

- A 'heartbeat' flashType is not a lightning strike. It is used internally by the software to maintain connection.

An example of an 'asset' is as follows:

```json
  {
    "assetName":"Dante Street",
    "quadKey":"023112133033",
    "assetOwner":"6720"
  }
```

---

You might notice that the lightning strikes are in lat/long format, whereas the assets are listed in quadkey format.

There is a simple conversion process, outlined [here](http://msdn.microsoft.com/en-us/library/bb259689.aspx) that you can take advantage of. Feel free to use an open source library as well.

For this purpose, you can assume that all asset locations are at a zoom level of '12'.

For each strike received, you should simply print to the console the following message:

```log
lightning alert for <assetOwner>:<assetName>
```

But substituting the proper assetOwner and assetName.

i.e.:

```log
lightning alert for 6720:Dante Street
```

There's a catch though... Once we know lightning is in the area, we don't want to be alerted for it over & over again. Therefore, if you have already printed an alert for a lightning strike at a particular location, you should ignore any additional strikes that occur in that quadkey for that asset owner.

---

## Implementation

Since code is read more often than it is written, we want to our projects well structured and the code easy to read. You should make sure your code lints against whatever standards are in common use by the language you choose (i.e. pep-8 for python, eslint for node.js)

Your program should also contain a README that contains information about the program and includes steps on how to run the program.

The files containing lightning strikes (as single JSON objects, mimicking lightning events) and assets (as an array of JSON objects) can be found in this repo. These files should be used *as is* as input.

Feel free to use open source libraries where available...

### What we are looking for

- Correctness. If the program doesn't run correctly, it doesn't matter how beautiful or efficient it is.
- Conciseness. Small is beautiful. Easy to read is paramount. The easier it is for someone else to come in and modify your program, the better.
- Reliability. You should expect to handle bad data, and expect to handle failures. Ideally this should be covered with automated tests.

### In addition, please answer the following questions:

- What is the [time complexity](https://en.wikipedia.org/wiki/Time_complexity) for determining if a strike has occurred for a particular asset?
- If we put this code into production, but found it too slow, or it needed to scale to many more users or more frequent strikes, what are the first things you would think of to speed it up?