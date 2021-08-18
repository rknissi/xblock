/* Javascript for MyXBlock. */
function MyXBlock(runtime, element, data) {

    var hints = [];
    var actualHint = -1;
    var currentWrongElementLine = -1;
    var currentWrongElementHintCounter = 0;
    var chart;
    var data;
    
    var submitGraphDataUrl = runtime.handlerUrl(element, 'submit_graph_data');

    function defineValues(value) {
        $('#question', element).text(value.title);

        $('#description', element).text(value.description);

        $('#subject', element).text(value.subject);

        var result = [];
        for(var i in value.tags)
            result.push([value.tags[i]]);
        
        $('#tags', element).text(result);

        document.getElementById("answer1").value = value.answer1;
        var itsLabel1 = $("[for=" + $("#answer1").attr("id") + "]");
        itsLabel1.text(value.answer1);

        document.getElementById("answer2").value = value.answer2;
        var itsLabel2 = $("[for=" + $("#answer2").attr("id") + "]");
        itsLabel2.text(value.answer2);
        
        document.getElementById("answer3").value = value.answer3;
        var itsLabel3 = $("[for=" + $("#answer3").attr("id") + "]");
        itsLabel3.text(value.answer3);

        document.getElementById("answer4").value = value.answer4;
        var itsLabel4 = $("[for=" + $("#answer4").attr("id") + "]");
        itsLabel4.text(value.answer4);

        document.getElementById("answer5").value = value.answer5;
        var itsLabel5 = $("[for=" + $("#answer5").attr("id") + "]");
        itsLabel5.text(value.answer5);

        if (value.alreadyAnswered == "True") {
            $("#hintButton").css("background", "grey");
            $("#answerButton").css("background", "grey");
            $("#prevHint").css("background", "grey");
            $("#nextHint").css("background", "grey");
            document.getElementById('userInput').readOnly = true;
            document.getElementById("hintButton").disabled = true;
            document.getElementById("answerButton").disabled = true;
            document.getElementById("nextHint").disabled = true;
            document.getElementById("prevHint").disabled = true;
            $(':radio:not(:checked)').attr('disabled', true);
        }
    }

    function showHint(value) {

        chart = anychart.graph(value.teste);
        data = value.teste;

        // set the title
        chart.title("Network Graph showing the battles in Game of Thrones");

        // access nodes
        var nodes = chart.nodes();

        // set the size of nodes
        nodes.normal().height(30);
        nodes.hovered().height(45);
        nodes.selected().height(45);

        // set the stroke of nodes
        nodes.normal().stroke(null);
        nodes.hovered().stroke("#333333", 3);
        nodes.selected().stroke("#333333", 3);

        // enable the labels of nodes
        chart.nodes().labels().enabled(true);

        // configure the labels of nodes
        chart.nodes().labels().format("{%id}");
        chart.nodes().labels().fontSize(12);
        chart.nodes().labels().fontWeight(600);

        chart.edges().arrows({
            enabled: true,
            size: 15
        });

        // draw the chart
        chart.container("graph2").draw();

        if (value.status == 'OK') {

            //Tratar os cassos
            //tenho nada e peço uma dica, e depois digito algo: vem de novo a primeira
            //Tenho tudo certo, e apago para ter dica do último passo (faz sentido?)

            //Mostrar que a linha está OK, por agora fazer nada
            $('#hint', element).append("\n" + value.hint);
            hints.push(value.hint);
            actualHint = hints.length - 1;
            document.getElementById('hint').innerHTML = hints[actualHint];

            //Contar as dicas corretamente
            for(var i = 0;i < lines.length;i++){
                if(value.lastCorrectElement == lines[i]) {
                    if (currentWrongElementLine == i) {
                        currentWrongElementHintCounter++;
                    } else {
                        currentWrongElementLine = i + 1;
                        currentWrongElementHintCounter = 1;
                    }
                } else {
                    endPos += lines[i].length;
                    continue;
                }
            }

            currentWrongElementLine = -1;
            currentWrongElementHintCounter = 0;
        } else {
            //Coloca a dica na pilha
            $('#hint', element).append("\n" + value.hint);
            hints.push(value.hint);
            actualHint = hints.length - 1;
            document.getElementById('hint').innerHTML = hints[actualHint];

            //Pega cada uma das respostas do usuário
            var lines = $('#userInput').val().split('\n');
            var endPos = 0;
            for(var i = 0;i < lines.length;i++){
                if(value.wrongElement == lines[i]) {
                    //Pega as posições e imprime
                    endPos += lines[i].length; 
                    if  (i == 0) {
                        startPos = 0;
                    } else {
                        endPos += i;
                        startPos = endPos - lines[i].length;
                    }

                    tarea = document.getElementById("userInput");
                    tarea.focus();
                    tarea.selectionStart = startPos;
                    tarea.selectionEnd = endPos;
                    tarea.value.substring(tarea.selectionStart, tarea.selectionEnd); 

                    if (currentWrongElementLine == i) {
                        currentWrongElementHintCounter++;
                    } else {
                        currentWrongElementLine = i;
                        currentWrongElementHintCounter = 1;
                    }
                } else {
                    endPos += lines[i].length;
                    continue;
                }
            }
        }
    }

    function reloadGraph(data){
        data.nodes = data.nodes.concat({"id": "Amor", "height": 50, "correctness": 1})
        data.nodes = data.nodes.concat({"id": "Amor2", "height": 50, "correctness": 1})
        data.edges = data.edges.concat({"from": "Amor", "to": "Amor2", "correctness": 1})

        chart.edges().arrows({
            enabled: false
        });

        chart.data(data);

        chart.edges().arrows({
            enabled: true,
            size: 15
        });

        chart.data(data);

    }

    function addNode(node){
        data.nodes = data.nodes.concat(node)

        chart.data(data);

    }

    function addEdge(edge){
        data.edges = data.edges.concat(edge)

        chart.data(data);

    }

    function showResults(value) {
        if(value.error) {
            alert(value.error);
            return;
        }
        $("#hintButton").css("background","grey");
        $("#answerButton").css("background","grey");
        $("#prevHint").css("background","grey");
        $("#nextHint").css("background","grey");
        document.getElementById('userInput').readOnly = true;
        document.getElementById("hintButton").disabled = true;
        document.getElementById("answerButton").disabled = true;
        document.getElementById("nextHint").disabled = true;
        document.getElementById("prevHint").disabled = true;
        $(':radio:not(:checked)').attr('disabled', true);
        alert(value.answer);
    }


    var send_answer = runtime.handlerUrl(element, 'send_answer');
    var get_hint_for_last_step = runtime.handlerUrl(element, 'get_hint_for_last_step');
    var getInitialData = runtime.handlerUrl(element, 'initial_data');

    $('#userInput').attr("rows", $('#userInput').val().split("\n").length+1||2);

    $(document).ready(function(eventObject) {
        $.ajax({
            type: "POST",
            url: getInitialData,
            data: JSON.stringify({}),
            success: defineValues
        });
    });

    $('#hintButton', element).click(function(eventObject) {
        var userAnswer = $(".userInput").val();

        $.ajax({
            type: "POST",
            url: get_hint_for_last_step,
            data: JSON.stringify({userAnswer: userAnswer, currentWrongElementHintCounter: currentWrongElementHintCounter}),
            success: showHint
        });
    });

    $('#answerButton', element).click(function(eventObject) {
        var userAnswer = $(".userInput").val();
        var radioAnswer = $("input:radio[name=radioAnswer]:checked").val()

        $.ajax({
            type: "POST",
            url: send_answer,
            data: JSON.stringify({answer: userAnswer, radioAnswer: radioAnswer, studentId: studentId}),
            success: showResults
        });
    });

    $('#prevHint', element).click(function(eventObject) {
        if (actualHint == -1) {
            return;
        }
        if (actualHint == 0) {
            actualHint = hints.length - 1;
        } else {
            actualHint--;
        }
        document.getElementById('hint').innerHTML = hints[actualHint];
        reloadGraph(data);


        var body = {
          graphData: data
        };

        $.ajax({
          type: "POST",
          url: submitGraphDataUrl,
          data: JSON.stringify(body),
          success: function (data) {
            console.log(data)
          }   
      });


    });

    $('#nextHint', element).click(function(eventObject) {
        if (actualHint == -1) {
            return;
        }
        if (actualHint == hints.length - 1) {
            actualHint = 0;
        } else {
            actualHint++;
        }
        document.getElementById('hint').innerHTML = hints[actualHint];
    });
    return {};
}
