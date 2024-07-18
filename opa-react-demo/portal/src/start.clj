(ns start
  (:require [portal.api :as p]))

(defn run [_]
  (p/start {:port 5678})
  @(promise))
