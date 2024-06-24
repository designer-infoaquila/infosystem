<?php

require __DIR__ . '/../inc/config.php';
require __DIR__ . '/../login/conn.php';
include __DIR__ . '/../inc/url.php';
include __DIR__ . '/../inc/functions.php';
include __DIR__ . '/../inc/company.php';
require __DIR__ . '/../vendor/autoload.php';

//declare(strict_types=1);

use NFePHP\NFe\Make;
use NFePHP\NFe\Complements;
use NFePHP\DA\NFe\Danfe;

// $id = anti_injection($_GET['id']);
$id = filter_input(INPUT_POST, "id", FILTER_DEFAULT);

$config = [
    "atualizacao" => date('Y-m-d h:i:s'),
    "tpAmb" => 1,
    "razaosocial" => "FUSION LASTRAS & MARMORES LTDA",
    "cnpj" => "51125803000103",
    "ie" => '121813312110',
    "siglaUF" => "SP",
    "schemes" => "PL_009_V4",
    "versao" => '4.00',
];

$configJson = json_encode($config);
$certificadoDigital = file_get_contents('../vendor/2000349254.pfx');

$c = $pdo->query("SELECT num FROM lote ");
$l = $c->fetch(PDO::FETCH_ASSOC);

$consulta = $pdo->query("SELECT * FROM nfe WHERE id_nfe = " . $id);
$linha = $consulta->fetch(PDO::FETCH_ASSOC);

$tools = new NFePHP\NFe\Tools($configJson, NFePHP\Common\Certificate::readPfx($certificadoDigital, '15101968'));

$xmlAssinado = file_get_contents(__DIR__ . '/assinadas/' . $linha['chave_acesso'] . '.xml');

$error = 0;

if ($linha['recibo'] != "") {
    $recibo = $linha['recibo'];
} else {
    try {
        $idLote = str_pad($l['num'], 15, '0', STR_PAD_LEFT);
        $resp = $tools->sefazEnviaLote([$xmlAssinado], $idLote);

        $st = new NFePHP\NFe\Common\Standardize();
        $std = $st->toStd($resp);
        if ($std->cStat != 103) {

            $error++;
            $modError = 'nfe';
            $errorNfe = $std->xMotivo;
        }
        $recibo = $std->infRec->nRec;

        $stmt = $pdo->prepare("UPDATE nfe SET recibo = '" . $recibo . "' WHERE id_nfe = " . $id);
        $stmt->execute();
    } catch (\Exception $e) {
        $errorRecibo = $e->getMessage();

        $error++;
        $modError = 'php';
    }
}

sleep(5);

if ($recibo != "") {
    try {
        $protocolo = $tools->sefazConsultaRecibo($recibo);
        //file_put_contents(__DIR__ . '/protocoladas/' . $linha['chave_acesso'] . '.xml', $protocolo);

        // echo 'Primeiro Resultado<br>';
        // print_r($protocolo);
        // echo '<hr>';

        $st = new NFePHP\NFe\Common\Standardize();
        $std = $st->toStd($protocolo);

        $status = $std->cStat;
        if ($std->cStat == 104) {
            if ($std->protNFe->infProt->cStat == 100) {

                file_put_contents(__DIR__ . '/protocoladas/' . $linha['chave_acesso'] . '.xml', $protocolo);

                $data_saida = new DateTime();

                $stmt = $pdo->prepare("UPDATE nfe SET protocolo = '" . $std->protNFe->infProt->nProt . "',status=2,data_saida='" . $data_saida->format('Y-m-d') . date('\TH:i:s') . "' WHERE id_nfe = " . $id);
                $stmt->execute();
            } else if ($std->protNFe->infProt->cStat == 539) {
                $error++;
                $modError = 'duplicado';
                $errorNfe = $std->protNFe->infProt->xMotivo;
            } else { // 
                $error++;
                $modError = 'nfe';
                $errorNfe = $std->protNFe->infProt->xMotivo;
            }
        } elseif ($std->cStat == 105) {
            $aguardando = 1;
        } else {
            if ($std->cStat == 100) {

                file_put_contents(__DIR__ . '/protocoladas/' . $linha['chave_acesso'] . '.xml', $protocolo);

                $data_saida = new DateTime();

                $stmt = $pdo->prepare("UPDATE nfe SET protocolo = '" . $std->nProt . "',status=2,data_saida='" . $data_saida->format('Y-m-d') . date('\TH:i:s') . "' WHERE id_nfe = " . $id);
                $stmt->execute();
            } else {
                $error++;
                $modError = 'nfe';
                $errorNfe = $std->xMotivo;
            }
        }
    } catch (\Exception $e) {

        $errorProcesso = $e->getMessage();

        $error++;
        $modError = 'php';
    }
} else {
    $errorProcesso = 'Não foi possível gerar o Recibo. Tente novamente mais tarde!!!';

    $error++;
    $modError = 'php';
}

if ($aguardando == 1 && $error == 0) {
    // echo 'Aguardando<br>';
    // print_r($protocolo);
    echo 'aguardando||';
} elseif ($aguardando == 0 && $error == 0) {
    // echo 'Acerto<br>';
    // print_r($protocolo);
    echo 'success||';
} else {
    $number_error = rand();

    if ($modError == 'php') {
        echo "error||Ocorreu um erro durante o processamento :" . $errorRecibo . "\n" . $errorProcesso;
        $stmt = $pdo->prepare("UPDATE nfe SET chave_acesso = '', recibo = '',status = 0 WHERE id_nfe = " . $id);
        $stmt->execute();

        unlink('assinadas/' . $linha['chave_acesso'] . '.xml');
    } else if ($modError == 'duplicado') {
        echo 'error||' . $errorNfe;
        $stmt = $pdo->prepare("UPDATE nfe SET status = 3 WHERE id_nfe = " . $id);
        $stmt->execute();
    } else {
        echo 'error||' . $errorNfe;
        $stmt = $pdo->prepare("UPDATE nfe SET chave_acesso = '', recibo = '',status = 0 WHERE id_nfe = " . $id);
        $stmt->execute();

        unlink('assinadas/' . $linha['chave_acesso'] . '.xml');
    }
    // echo 'Error|' . $modError . '<br>';
    // print_r($protocolo);

}

$Lt = $l['num'] + 1;
$stmt_ = $pdo->prepare("UPDATE lote SET num = " . $Lt);
$stmt_->execute();

/* Nota de HOMOLOGAÇÃO 100 */