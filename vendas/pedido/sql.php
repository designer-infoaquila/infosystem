<?
session_start();
require __DIR__ . '/../../login/conn.php';
include __DIR__ . '/../../inc/url.php';
include __DIR__ . '/../../inc/functions.php';
include __DIR__ . '/../../inc/company.php';

$type = $_POST['type'];
$data = date('Y-m-d');

$columns = array('os', 'data', 'emissor', 'vendedor', 'cliente', 'telefone', 'email', 'validade', 'obra', 'endereco', 'prazo', 'condicao', 'desconto', 'frete', 'custos', 'observacao', 'sem', 'status', 'id_empresa');
$column_insert = join(', ', $columns);

$param_insert = join(', ', array_map(function ($columns) {
    return ":$columns";
}, $columns));

$columns_ = array('emissor', 'vendedor', 'cliente', 'telefone', 'email', 'validade', 'obra', 'endereco', 'prazo', 'condicao', 'desconto', 'frete', 'custos', 'observacao', 'sem');

$param_update = join(', ', array_map(
    function ($columns_) {
        return "$columns_ = :$columns_";
    },
    $columns_
));

/* Begin::Adicionar */
if ($type == 'orcamento_add') {

    $dataNow = new DateTime('now');

    if (filter_input(INPUT_POST, 'desconto', FILTER_DEFAULT) == '') {
        $desconto = 0;
    } else {
        $desconto = str_replace(",", ".", str_replace(".", "", filter_input(INPUT_POST, 'desconto', FILTER_DEFAULT)));
    }
    if (filter_input(INPUT_POST, 'frete', FILTER_DEFAULT) == '') {
        $frete = 0;
    } else {
        $frete = str_replace(",", ".", str_replace(".", "", filter_input(INPUT_POST, 'frete', FILTER_DEFAULT)));
    }
    if (filter_input(INPUT_POST, 'custos', FILTER_DEFAULT) == '') {
        $custos = 0;
    } else {
        $custos = str_replace(",", ".", str_replace(".", "", filter_input(INPUT_POST, 'custos', FILTER_DEFAULT)));
    }

    if (isset($_POST['sem'])) {
        $sem = 1;

        $columnsC = array('codigo', 'pessoa',  'nome', 'nomes', 'documento', 'documentos', 'email', 'telefone', 'celular', 'cep', 'endereco', 'numero', 'complemento', 'bairro', 'cod_municipio', 'municipio', 'uf',  'cep2', 'endereco2', 'numero2', 'complemento2', 'bairro2', 'cod_municipio2', 'municipio2', 'uf2', 'sem', 'id_empresa');
        $columnC_insert = join(', ', $columnsC);

        $paramC_insert = join(', ', array_map(function ($columnsC) {
            return ":$columnsC";
        }, $columnsC));

        $sqlC = 'INSERT INTO clientes (' . $columnC_insert . ') VALUES(' . $paramC_insert . ')';
        $stmtC = $pdo->prepare($sqlC);
        $parametersC = array(
            ':codigo' => "",
            ':pessoa' => "fisica",
            ':nome' => filter_input(INPUT_POST, "clientesem", FILTER_DEFAULT),
            ':nomes' => filter_input(INPUT_POST, "clientesem", FILTER_DEFAULT),
            ':documento' => "",
            ':documentos' => "",
            ':email' => "",
            ':telefone' => "",
            ':celular' => "",
            ':cep' => "",
            ':endereco' => "",
            ':numero' => "",
            ':complemento' => "",
            ':bairro' => "",
            ':cod_municipio' => "",
            ':municipio' => "",
            ':uf' => "",
            ':cep2' => "",
            ':endereco2' => "",
            ':numero2' => "",
            ':complemento2' => "",
            ':bairro2' => "",
            ':cod_municipio2' => "",
            ':municipio2' => "",
            ':uf2' => "",
            ':sem' => 1,
            ':id_empresa' => $company,
        );
        $stmtC->execute($parametersC);

        $id_cliente = $pdo->lastInsertId();
        $cliente = $id_cliente;
    } else {
        $sem = 0;

        $cliente = filter_input(INPUT_POST, "cliente", FILTER_DEFAULT);
    }

    try {
        $sql = 'INSERT INTO orcamentos (' . $column_insert . ') VALUES(' . $param_insert . ')';
        $stmt = $pdo->prepare($sql);
        $parameters = array(
            ':os' => filter_input(INPUT_POST, "os", FILTER_DEFAULT),
            ':data' => $dataNow->format('Y-m-d'),
            ':emissor' => filter_input(INPUT_POST, "emissor", FILTER_DEFAULT),
            ':vendedor' => filter_input(INPUT_POST, "vendedor", FILTER_DEFAULT),
            ':cliente' => $cliente,
            ':telefone' => filter_input(INPUT_POST, "telefone", FILTER_DEFAULT),
            ':email' => filter_input(INPUT_POST, "email", FILTER_DEFAULT),
            ':validade' => filter_input(INPUT_POST, "validade", FILTER_DEFAULT),
            ':obra' => filter_input(INPUT_POST, "obra", FILTER_DEFAULT),
            ':endereco' => filter_input(INPUT_POST, "endereco", FILTER_DEFAULT),
            ':prazo' => filter_input(INPUT_POST, "prazo", FILTER_DEFAULT),
            ':condicao' => filter_input(INPUT_POST, "condicao", FILTER_DEFAULT),
            ':desconto' => $desconto,
            ':frete' => $frete,
            ':custos' => $custos,
            ':observacao' => filter_input(INPUT_POST, 'observacao', FILTER_DEFAULT),
            ':sem' => $sem,
            ':status' => "1",
            ':id_empresa' => $company,
        );
        $stmt->execute($parameters);

        $id_company = $pdo->lastInsertId();

        $stmt_ = $pdo->prepare('UPDATE orcamentos_produtos SET temp = 0 WHERE id_orcamento = ' . $id_company);
        $stmt_->execute();

        echo 'success||';
    } catch (PDOException $e) {
        $number_error = rand();

        $fp = fopen("../../report/error_log_" . date('dmY') . ".txt", "a");
        $escreve = fwrite($fp, $number_error . "|orcamento_add|" . debugPDO($sql, $parameters) . "\n\n");
        fclose($fp);

        echo "error||Algo deu errado, informe o numero <b>" . $number_error . "</b> para o Administrador do sistema!";
    }
}

if ($type == 'pagamento_add') {

    // echo 'teste';
    // die();

    $columnsE = array('forma', 'id_prazo', 'valor', 'id_pedido', 'temp');
    $columnE_insert = join(', ', $columnsE);

    $paramE_insert = join(', ', array_map(function ($columnsE) {
        return ":$columnsE";
    }, $columnsE));

    try {
        $sqlE = 'INSERT INTO pedidos_pagamentos (' . $columnE_insert . ') VALUES(' . $paramE_insert . ')';
        $stmtE = $pdo->prepare($sqlE);
        $parametersE = array(
            ':forma' => filter_input(INPUT_POST, "forma", FILTER_DEFAULT),
            ':id_prazo' => filter_input(INPUT_POST, "prazo", FILTER_DEFAULT),
            ':valor' => str_replace(",", ".", str_replace(".", "", filter_input(INPUT_POST, 'valor', FILTER_DEFAULT))),
            ':id_pedido' => filter_input(INPUT_POST, "id_pedido", FILTER_DEFAULT),
            ':temp' => '1',

        );
        $stmtE->execute($parametersE);
        echo 'success||';
    } catch (PDOException $e) {
        $number_error = rand();

        $fp = fopen("../../report/error_log_" . date('dmY') . ".txt", "a");
        $escreve = fwrite($fp, $number_error . "|pagamento_add|" . debugPDO($sqlE, $parametersE) . "\n\n");
        fclose($fp);

        echo "error||Algo deu errado, informe o numero <b>" . $number_error . "</b> para o Administrador do sistema!";
    }
}

if ($type == 'produto_add') {

    $produto_erro = 0;

    $id_pedido = filter_input(INPUT_POST, 'id_pedido', FILTER_DEFAULT);

    $columns = array('item', 'chapas', 'descricao', 'medidas', 'metro', 'valor', 'subtotal', 'temp', 'id_produto', 'id_pedido');
    $column_insert = join(', ', $columns);

    $param_insert = join(', ', array_map(function ($columns) {
        return ":$columns";
    }, $columns));

    $item = 1;

    foreach ($_SESSION['produtos'] as $key => $value) {
        $consulta = $pdo->query("SELECT * FROM romaneio_estoque WHERE id_r_estoque = " . $value);
        $linha = $consulta->fetch(PDO::FETCH_ASSOC);

        $consulta_ = $pdo->query("SELECT descricao,valor FROM produtos WHERE id_produto = " . $linha['id_produto']);
        $linha_ = $consulta_->fetch(PDO::FETCH_ASSOC);

        $subtotal = $linha['metro'] * $linha_['valor'];
        try {

            $sql = 'INSERT INTO pedidos_produtos (' . $column_insert . ') VALUES(' . $param_insert . ')';
            $stmt = $pdo->prepare($sql);

            $parameters = array(
                ':item' => $item,
                ':chapas' => $linha['chapas'],
                ':descricao' => $linha_['descricao'],
                ':medidas' => $linha['espessura'] . 'x ' . $linha['comprimento'] . 'x ' . $linha['altura'],
                ':metro' => $linha['metro'],
                ':valor' => $linha_['valor'],
                ':subtotal' => $subtotal,
                ':temp' =>  "1",
                ":id_produto" => $linha['id_produto'],
                ":id_pedido" => $id_pedido
            );

            $stmt->execute($parameters);
        } catch (PDOException $e) {
            $produto_erro++;

            $produto_debug .= debugPDO($sql, $parameters) . "\n";
        }

        $item++;
    }

    if ($produto_erro == 0) {
        echo "success||";
    } else {
        $number_error = rand();

        $fp = fopen("../../report/error_log_" . date('dmY') . ".txt", "a");
        fwrite($fp, $number_error . "|produto_add|" . $produto_debug . "\n\n");

        fclose($fp);

        echo "error||Algo deu errado, informe o numero <b>" . $number_error . "</b> para o Administrador do sistema!";
    }
}


/* End::Adicionar */

/* Begin::Editar */

/* End::Editar */

/* Begin::Remover */

if ($type == 'pagamento_remove') {

    try {
        $stmt = $pdo->prepare('DELETE FROM pedidos_pagamentos WHERE id_pedido_pagamento = ' . filter_input(INPUT_POST, "id", FILTER_DEFAULT));
        $stmt->execute();

        echo 'success||';
    } catch (PDOException $e) {
        $number_error = rand();

        $fp = fopen("../report/error_log_" . date('dmY') . ".txt", "a");
        $escreve = fwrite($fp, $number_error . "|pagamento_remove|DELETE FROM pedidos_pagamentos WHERE id_pedido_pagamento = " . filter_input(INPUT_POST, "id", FILTER_DEFAULT) . "\n\n");
        fclose($fp);

        echo "error||Algo deu errado, informe o numero <b>" . $number_error . "</b> para o Administrador do sistema!";
    }
}
/* end::Remover */

/* begin::Outros */
if ($type == 'produtos_session_add') {

    $_SESSION['produtos'][] = $_POST['produtos'];
}
if ($type == 'produtos_session_remove') {

    if (($key = array_search($_POST['produtos'], $_SESSION['produtos'])) !== false) {
        unset($_SESSION['produtos'][$key]);
    }
}
if ($type == 'produtos_session_remove_all') {

    unset($_SESSION['produtos']);
}
if ($type == 'materiais_view') {
    $id_pedido = filter_input(INPUT_POST, 'id_pedido', FILTER_DEFAULT);

    $total_chapas = 0;
    $total_metro = 0;
    $total_valor = 0;

    $consultaProd = $pdo->query("SELECT * FROM pedidos_produtos as t1 INNER JOIN produtos as t2 ON t1.id_produto = t2.id_produto  WHERE id_pedido = " . $id_pedido . " ORDER BY item ASC");
    $total = $consultaProd->rowCount();
    if ($total >= 1) {
        while ($linhaProd = $consultaProd->fetch(PDO::FETCH_ASSOC)) {

            $loopProd .= '<tr>
                <td class="text-center">' . $linhaProd['item'] . '</td>
                <td class="text-center">' . $linhaProd['chapas'] . '</td>
                <td style="width:300px; text-align:center;">' . mb_strtoupper($linhaProd['descricao']) . '</td>
                <td>' . $linhaProd['medidas'] . '</td>
                <td class="text-nowrap text-right">' . number_format($linhaProd['metro'], 3, ",", "") . '</td>
                <td class="text-nowrap text-right">R$ ' . number_format($linhaProd['valor'], 2, ",", ".") . '</td>
                <td class="text-nowrap text-right">R$ ' . number_format($linhaProd['subtotal'], 2, ",", ".") . '</td>
                <td class="text-center" >
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon RemoverMaterial" title="Remover" id="' . $linhaProd['id_p_produto'] . '">
                        <i class="la la-trash"></i>
                    </a>
                </td>
            </tr>';

            $total_chapas += $linhaProd['chapas'];
            $total_metro += $linhaProd['metro'];
            $total_valor += $linhaProd['subtotal'];
        }

        $loopProd .= '<tr>
                <th class="text-center">Totais</th>
                <th class="text-center">' . $total_chapas . '</th>
                <th></th>
                <th></th>
                <th class="text-nowrap text-right">' . number_format($total_metro, 3, ",", "") . '</th>
                <th></th>
                <th></th>
                <th></th>
            </tr>';
    } else {
        $loopProd = '<tr>
            <th class="text-center" colspan="8">Sem Produtos cadastrados</th>
        </tr>';
    }

    $txt_total = '<div class="mr-5 text-right" style="line-height: 1.25;">
        <span>Total do Pedido</span><br>
        <span style="font-weight: 800;font-size: 22px;">R$ ' . number_format($total_valor, 2, ",", ".") . '</span>
    </div>';

    echo $loopProd . "||" . number_format($total_valor, 2, ",", ".") . "||" . $txt_total;
}
if ($type == 'materiais_remove') {

    try {

        $stmt_ = $pdo->prepare('DELETE FROM pedidos_produtos WHERE id_p_produto = :id');
        $stmt_->bindParam(':id', $_POST['id']);
        $stmt_->execute();

        echo 'success||';
    } catch (PDOException $e) {
        $number_error = rand();

        $fp = fopen("../../report/error_log_" . date('dmY') . ".txt", "a");
        $escreve = fwrite($fp, $number_error . "|materiais_remove|DELETE FROM pedidos_produtos WHERE id_p_produto = " . $_POST['id'] . "\n\n");
        fclose($fp);

        echo "error||Algo deu errado, informe o numero <b>" . $number_error . "</b> para o Administrador do sistema!";
    }
}
/* end::Outro */