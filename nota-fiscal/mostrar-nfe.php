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

/* Gravando a Nfe no banco de Dados */

$id = $_GET['id'];
// $id = filter_input(INPUT_POST, "id", FILTER_DEFAULT);

$consulta = $pdo->query("SELECT * FROM nfe WHERE id_nfe = " . $id);
$linha = $consulta->fetch(PDO::FETCH_ASSOC);

$xmlView = file_get_contents(__DIR__ . '/assinadas/' . $linha['chave_acesso'] . '.xml');
$logo = '';

$danfe = new Danfe($xmlView);
$danfe->exibirTextoFatura = false;
$danfe->exibirPIS = false;
$danfe->exibirIcmsInterestadual = false;
$danfe->exibirValorTributos = false;
$danfe->descProdInfoComplemento = false;
$danfe->exibirNumeroItemPedido = false;
$danfe->setOcultarUnidadeTributavel(true);
$danfe->obsContShow(false);
$danfe->printParameters(
    $orientacao = 'P',
    $papel = 'A4',
    $margSup = 2,
    $margEsq = 2
);
$danfe->logoParameters($logo, $logoAlign = 'C', $mode_bw = false);
$danfe->setDefaultFont($font = 'times');
$danfe->setDefaultDecimalPlaces(4);
$danfe->debugMode(false);
$danfe->creditsIntegratorFooter('InfoSystem - https://www.infosystem.com.br');

/*  $this->printParameters( $orientacao = '', $papel = 'A4', $margSup = 2, $margEsq = 2 );  || Caso queira mudar a configuracao padrao de impressao*/
/*  $this->setOcultarUnidadeTributavel(true);  || Caso queira sempre ocultar a unidade tributável*/
/*  $danfe->depecNumber('123456789');  || Informe o numero DPEC*/
/*  $danfe->logoParameters($logo, 'C', false); || Configura a posicao da logo */

$pdf = $danfe->render($logo);
header('Content-Type: application/pdf');
echo $pdf;
