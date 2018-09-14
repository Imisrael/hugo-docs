+++
title = "Hadoop and Spark Connector"
weight = 3
+++

### Overview

The Hadoop MapReduce GridDB connector is a Java library for using GridDB as an input source and output destination for Hadoop MapReduce jobs. This library allows the GridDB performance to be used directly by MapReduce jobs through in-memory processing.

#### Operating Environment

Building of the library and execution of the sample programs are checked in the environment below.

OS:         CentOS6.7(x64)
Java:       JDK 1.8.0_60
Maven:      apache-maven-3.3.9
Hadoop:     CDH5.7.1(YARN)

### QuickStart

#### Preparations

Build a GridDB Java client and place the created gridstore.jar under the lib directory.

#### Build

Run the mvn command like the following: $ mvn package and create the following jar files.

gs-hadoop-mapreduce-client/target/gs-hadoop-maprduce-client-1.0.0.jar
gs-hadoop-mapreduce-examples/target/gs-hadoop-maprduce-examples-1.0.0.jar

#### Running The Sample Program

An operating example to run the WordCount program using GridDB is shown below. GridDB and Hadoop (HDFS and YARN) need to be started in advance. Run the following in an environment in which these and hadoop commands can be used.

$ cd gs-hadoop-mapreduce-examples
$ ./exec-example.sh \
\> --job wordcount \
\> --define notificationAddress= \
\> --define notificationPort= \
\> --define clusterName= \
\> --define user= \
\> --define password= \
\> pom.xml 2> /dev/null | sort -r

   5        5 
   3        org.apache.hadoop
   3        com.toshiba.mwcloud.gs.hadoop
... 

The first number is the number of occurrences while the right side is a word in the file (pom.xml) specified as a processing target. See gs-hadoop-mapreduce-examples/README.md for details about the sample programs.

Spark Connector
---------------

The Spark Connector can be downloaded from our [downloads page](/en/downloads/).

Full list of dependencies:

*   **OS:** CentOS6.7(x64)
*   **Maven:** apache-maven-3.3.9
*   **Java:** JDK 1.8.0_101
*   **Apache Hadoop:** Version 2.6.5
*   **Apache Spark:** Version 2.1.0
*   **Scala:** Version 2.11.8
*   **GridDB server and Java client:** 3.0 CE
*   **GridDB connector for Apache Hadoop MapReduce:** 1.0

If beginning from scratch, I recommend ensuring all of these items are installed and configured. This tutorial also assumes that your Hadoop, Spark, and Connector are all installed in the `[INSTALL_FOLDER]` directory (I used `/opt`).

Installation
------------

Once verified, please proceed with the steps outlined below:

We start this process off with adding the following environment variables to `.bashrc`

$ nano ~/.bashrc

 export JAVA_HOME=/usr/lib/jvm/\[JDK folder\]
 export HADOOP\_HOME=\[INSTALL\_FOLDER\]/hadoop-2.6.5
 export SPARK\_HOME=\[INSTALL\_FOLDER\]/spark-2.1.0-bin-hadoop2.6
 export GRIDDB\_SPARK=\[INSTALL\_FOLDER\]/griddb_spark
 export GRIDDB\_SPARK\_PROPERTIES=$GRIDDB_SPARK/gd-config.xml
 
 export PATH=$HADOOP\_HOME/sbin:$HADOOP\_HOME/bin:$SPARK_HOME/bin:$PATH
 
 export HADOOP\_COMMON\_LIB\_NATIVE\_DIR=$HADOOP_HOME/lib/native
 export HADOOP\_OPTS="$HADOOP\_OPTS -Djava.library.path=$HADOOP_HOME/lib/native"

$ source ~/.bashrc

Once those are added, modify the `gd-config.xml` file.

$ cd $GRIDDB_SPARK
$ nano gd-config.xml

 <!\-\- GridDB properties -->
 <property>
 	 <name>gs.user </name>
 	 <value>\[GridDB user\] </value>
 </property>
 <property>
 	 <name>gs.password </name>
 	 <value>\[GridDB password\] </value>
 </property>
 <property>
 	 <name>gs.cluster.name </name>
 	 <value>\[GridDB cluster name\] </value>
 </property>
  <!\-\- Define address and port for multicast method, leave it blank if using other method -->
 <property>
 	 <name>gs.notification.address </name>
 	 <value>\[GridDB notification address(default is 239.0.0.1)\] </value>
 </property>
 <property>
 	 <name>gs.notification.port </name>
 	 <value>\[GridDB notification port(default is 31999)\] </value>
 </property>

### Build The Connector + An Example

Next up, refer to this [configuration](https://github.com/griddb/griddb_spark/blob/master/Configuration.md) page for a quick definition of each of the GridDB properties.

To build a GridDB Java client and a GridDB connector for Hadoop MapReduce, place the following files under the `$GRIDDB_SPARK/gs-spark-datasource/lib` directory.

gridstore.jar
gs-hadoop-mapreduce-client-1.0.0.jar

(Note: these `.jar` files should have been created when you built your GridDB client and the GridDB Mapreduce Connector. You can find `gridstore.jar` in `/usr/griddb-X.X.X/bin`, for example)

Once that's complete, add the SPARK_CLASSPATH to "spark-env.sh"

$ cd $SPARK_HOME
$ nano conf/spark-env.sh

 SPARK\_CLASSPATH=.:$GRIDDB\_SPARK/gs-spark-datasource/target/gs-spark-datasource.jar:$GRIDDB\_SPARK/gs-spark-datasource/lib/gridstore.jar:$GRIDDB\_SPARK/gs-spark-datasource/lib/gs-hadoop-mapreduce-client-1.0.0.jar

Now that we've got the prerequisites out of the way, we can continue on to build the connector and an example to ensure everything is working properly.

To begin, we will need to edit our `Init.java` file to add the correct authentication credientials.

$ cd $SPARK_HOME/gs-spark-datasource-example/src/
$ nano Init.java

And add in your credentials:

Properties props = new Properties();
props.setProperty("notificationAddress", "239.0.0.1");
props.setProperty("notificationPort", "31999");
props.setProperty("clusterName", "Spark-Cluster");
props.setProperty("user", "admin");
props.setProperty("password", "hunter2");
GridStore store = GridStoreFactory.getInstance().getGridStore(props);

And now we can run the mvn command like so:

$ cd $GRIDDB_SPARK
$ mvn package

which will create the following `.jar` files:

gs-spark-datasource/target/gs-spark-datasource.jar
gs-spark-datasource-example/target/example.jar

Now proceed with running the example program. First start your GridDB cluster. And then:

Put some data into the server with the GridDB Java client

$ cd $GRIDDB_SPARK
$ java -cp ./gs-spark-datasource-example/target/example.jar:gs-spark-datasource/lib/gridstore.jar Init

Queries
-------

Now you can run queries with your GridDB connector for Spark:

$ spark-submit --class Query ./gs-spark-datasource-example/target/example.jar

We will go over some brief examples of Apache Spark's API. Examples are pulled from the [official page](https://spark.apache.org/examples.html).

Spark's defining feature is its RDD (Resilient Distributed Datasets) and the accompanying API. RDDs are immutable data structures that can be run in parallel on commodity hardware -- essentially it is exactly what allows Spark to run its queries in parallel and outperform MapReduce. Here's a very basic example; it will showcase how to build an RDD of the numbers 1 - 5

List data = Arrays.asList(1, 2, 3, 4, 5);
JavaRDD distData = sc.parallelize(data); 

With this, you can now run that small array in parallel. Pretty cool, huh?

#### Command Line Query

A "must-run" query in the Big Data scene is running a word count, so here's what it looks like on Spark. For this example, let's try using the shell (example taken from: [here](https://www.dezyre.com/apache-spark-tutorial/spark-tutorial)). To run this, please be sure you place a text file `input.txt` into your `$GRIDDB_SPARK` directory. Fill it with whatever text you like; I used the opening chapter of _Moby Dick_ . Now fire up the spark shell:

$ spark-shell 

[![](https://griddb.net/en/wp-content/uploads/2017/08/Screenshot_7.png)](https://griddb.net/en/wp-content/uploads/2017/08/Screenshot_7.png)

scala> val inputfile = sc.textFile ("input.txt")
inputfile: org.apache.spark.rdd.RDD\[String\] = input.txt MapPartitionsRDD\[1\] at textFile at :24

scala> val counts = inputfile.flatMap (line => line.split (" " )).map (word => (word, 1)).reduceByKey(_+_)
counts: org.apache.spark.rdd.RDD\[(String, Int)\] = ShuffledRDD\[4\] at reduceByKey at :26

scala> counts.saveAsTextFile ("output") 

And now if you head back into `$GRIDDB_SPARK`, you should find the `output` dir. Now just run a simple `cat` on the file in there to retrieve the word count results of your text file.

$ cd $GRIDDB_SPARK
$ cd output
$ cat part-00000 
(Ah!,1)
(Let,1)
(dreamiest,,1)
(dotings,1)
(cooled,1)
(spar,1)
(previous,2)
(street,,1)
(old,6)
(left,,1)
(order,2)
(told,1)
(marvellous,,1)
(Now,,1)
(virtue,1)
(Take,1)

#### TS Query

Of course, Spark is also capable of handling much more complex queries. Because GridDB ideally deals mostly in TimeSeries (TS) data, how about we take a look into a TS query? Here's a sample query taken from [here](http://sryza.github.io/spark-timeseries/0.3.0/docs/users.html):

val tsRdd: TimeSeriesRDD = ...

// Find a sub-slice between two dates 
val zone = ZoneId.systemDefault()
val subslice = tsRdd.slice(
  ZonedDateTime.of(LocalDateTime.parse("2015-04-10T00:00:00"), zone)
  ZonedDateTime.of(LocalDateTime.parse("2015-04-14T00:00:00"), zone))

// Fill in missing values based on linear interpolation
val filled = subslice.fill("linear")

// Use an AR(1) model to remove serial correlations
val residuals = filled.mapSeries(series => ar(series, 1).removeTimeDependentEffects(series))

### License

The Hadoop MapReduce GridDB connector source license is Apache License, version 2.0.
