+++
title = "Run a Sample Java Client App"
weight = 4
+++

#### Build a Client

```
$ ant -f java_client/build.xml
```


#### Execute a sample program

```
$ export CLASSPATH=${CLASSPATH}:$GS_HOME/bin/gridstore.jar
$ mkdir gsSample
$ cp $GS_HOME/docs/sample/program/Sample1.java gsSample/.
$ javac gsSample/Sample1.java
$ java gsSample/Sample1 239.0.0.1 31999 your_clustername admin your_password
--> Person:  name=name02 status=false count=2 lob=[65, 66, 67, 68, 69, 70, 71, 72, 73, 74]
```

