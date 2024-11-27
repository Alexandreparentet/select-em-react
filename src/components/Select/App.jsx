import React, { useState, useEffect } from "react";
import "./style.css";

export default function Select() {
  const [macroregioes, setMacroregioes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  const [selectedMacroregiao, setSelectedMacroregiao] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedCidade, setSelectedCidade] = useState("");

  // Fetch na API do IBGE para Macroregiões
  useEffect(() => {
    const fetchMacroregioes = async () => {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/regioes/"
        );
        const data = await response.json();
        setMacroregioes(data);
      } catch (error) {
        console.error("Erro ao buscar macroregiões:", error);
      }
    };

    fetchMacroregioes();
  }, []);

  // Fetch na API do IBGE para Estados com base na Macroregião
  useEffect(() => {
    if (selectedMacroregiao) {
      const fetchEstados = async () => {
        try {
          const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/regioes/${selectedMacroregiao}/estados`
          );
          const data = await response.json();
          setEstados(data);
          setSelectedEstado(""); // Resetar estado ao mudar macroregião
          setCidades([]); // Resetar cidades
        } catch (error) {
          console.error("Erro ao buscar estados:", error);
        }
      };

      fetchEstados();
    }
  }, [selectedMacroregiao]);

  // Fetch na API do IBGE para Cidades com base no Estado
  useEffect(() => {
    if (selectedEstado) {
      const fetchCidades = async () => {
        try {
          const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios`
          );
          const data = await response.json();
          setCidades(data);
          setSelectedCidade(""); // Resetar cidade ao mudar estado
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
        }
      };

      fetchCidades();
    }
  }, [selectedEstado]);

  return (
    <>
      <div className="select-options">
        {/* Dropdown de Macroregião */}
        <select
          className="section-select"
          value={selectedMacroregiao}
          onChange={(e) => setSelectedMacroregiao(e.target.value)}
        >
          <option value="" disabled hidden>
            Macroregião
          </option>
          {macroregioes.map((macroregiao) => (
            <option key={macroregiao.id} value={macroregiao.id}>
              {macroregiao.nome}
            </option>
          ))}
        </select>

        {/* Dropdown de Estados (habilitado após selecionar Macroregião) */}
        <select
          className="section-select"
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          disabled={!selectedMacroregiao} // Desabilitado se Macroregião não for selecionada
        >
          <option value="" disabled hidden>
            Estados
          </option>
          {estados.map((estado) => (
            <option key={estado.id} value={estado.sigla}>
              {estado.nome}
            </option>
          ))}
        </select>

        {/* Dropdown de Cidades (habilitado após selecionar Estado) */}
        <select
          className="section-select"
          value={selectedCidade}
          onChange={(e) => setSelectedCidade(e.target.value)}
          disabled={!selectedEstado} // Desabilitado se Estado não for selecionado
        >
          <option value="" disabled hidden>
            Cidades
          </option>
          {cidades.map((cidade) => (
            <option key={cidade.id} value={cidade.nome}>
              {cidade.nome}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
