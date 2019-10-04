# ubuntu 18.04
FROM ubuntu:bionic   

LABEL mantainer="d.galaktionov@udc.es"

# RUN mkdir /root/data && mkdir /root/view

COPY trippy-gis /root/
COPY data/trippy.db /root/data/
COPY data/common /root/data/common/
COPY data/indexes /root/data/indexes/
COPY view/*.* /root/view/

WORKDIR /root
ENTRYPOINT /root/trippy-gis
