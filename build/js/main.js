console.info('TiG Init');

(function (window, $) {
    firebaseDatabase = firebase.database();
    //console.log(firebaseDatabase);

    function writeUserData(data) {
        var userId = data.uid;
        firebaseDatabase.ref('contatos/' + userId).set(data);
    }

    $("#cadastro").validate({
        submitHandler: function(form) {                
            let formulario = $(form);
            let dataForm = formDataToJson(formulario);
            let tipo = ['aluno', 'professor'];

            const aluno = new Contato(
                dataForm.nome, 
                dataForm.email,
                getEscolaAttr(dataForm.escola, 'new_co_entidade'), 
                getEscolaAttr(dataForm.escola, 'new_escolasid'), 
                dataForm.escola, 
                dataForm.serie, 
                dataForm.turno,
                tipo[0]
            );

            const professor = new Contato(
                dataForm.nome_professor, 
                dataForm.email_professor, 
                getEscolaAttr(dataForm.escola, 'new_co_entidade'), 
                getEscolaAttr(dataForm.escola, 'new_escolasid'), 
                dataForm.escola, 
                dataForm.serie, 
                dataForm.turno,
                tipo[1]
            );

            //console.log(aluno);
            //console.log(professor);

            // Firebase
            writeUserData(aluno);
            writeUserData(professor);
            back();
        }
    });

    
    function formDataToJson(form) {
        var formData = form.serializeArray();
        var objData = {};

        $.map(formData, function(n, i){
            objData[n['name']] = n['value'];
        });

        return objData;
    }

    function back() {
        console.log('enviado');
        $('#modal').modal();
        document.getElementById("cadastro").reset();
    }

    function Contato(nome, email, co_entidade, escolasid, no_entidade, serie, turno, tipo) {
        this.uid = guid();
        this.nome = nome;
        this.email = email;
        this.co_entidade = co_entidade;
        this.escolasid = escolasid;
        this.escola = no_entidade;
        this.serie = serie;
        this.turno = turno;
        this.tipo = tipo;
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function getEscolaId(nomeEscola) {
        var arrayEscolas = escolasData;
        var id = "";
        for (let i = 0; i < arrayEscolas.length; i++) {
            const element = arrayEscolas[i];
            if (element['new_no_entidade'] == nomeEscola) {
                var id = element['new_escolasid'];
            }
        }
        return id ;
    }

    function getEscolaAttr(nomeEscola, attr) {
        var arrayEscolas = escolasData;
        var value = "";
        for (let i = 0; i < arrayEscolas.length; i++) {
            const element = arrayEscolas[i];
            if (element['new_no_entidade'] == nomeEscola) {
                var value = element[attr];
            }
        }
        return value ;
    }
    
    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;
            matches = [];
            substrRegex = new RegExp(q, 'i');
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });
            cb(matches);
        };
    };

    var data = escolasData;
    var escolas = [];
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        escolas.push(element['new_no_entidade'])
    }

    $('#escolagroup .typeahead').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'escolas',
            source: substringMatcher(escolas)
        }
    );


    


})(window, jQuery);


