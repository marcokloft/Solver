
##### To Do

* einen Button zum Laden einer Beispiel Aufgabe ([vlt das hier?](https://developers.google.com/optimization/scheduling/job_shop#example))
* labels einfügen für die Translate-Messages, dann unter src/main/resources/messages/messages.properties die entsprechenden (deutschen) Strings anlegen
* -> Bsp.: `<button id="solve">th:text="#{powerlp.solveButton}"</button>`
* validierung der input elemente (workaround mit einem form drumrum, vor dem lösen form abschicken, dann wird html5 validation getriggert -> siehe iterator (pattern wäre dann nur positive integer)
* import ist fragwürdig -> am Besten Grütz fragen!

###### Result

* anzeigen des Result (siehe hierzu die bisherige offline version von job shop)
* traumhaft wäre natürlich eine visualiesierung mit einem gantt diagramm
* export (kommt dann wenn der solver drangehängt ist)
