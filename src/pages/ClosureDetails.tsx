import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { toast } from "sonner";

interface Service {
  servicedate:string
  categorydescription:string
  totalValue:number
}

const formatBRL = (value:number)=>
 new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value);

const ClosureDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [services,setServices] = useState<Service[]>([]);

  useEffect(()=>{

    const loadDetails = async ()=>{

      try{

        const res = await api.get(`/closure-details/${id}`);
        setServices(res.data.services || []);

      }catch(err){

        console.error(err);
        toast.error("Erro ao carregar serviços");

      }

    };

    loadDetails();

  },[id]);

  return (

    <div className="min-h-screen bg-background">

      <div className="page-container animate-fade-in">

        <Button
          variant="ghost"
          onClick={()=>navigate(`/closure-overview/${id}`)}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4"/>
          Voltar
        </Button>

        <h1 className="section-title mb-8">
          Serviços do Fechamento
        </h1>

        <div className="table-container">

          <table className="w-full">

            <thead>

              <tr className="border-b border-border-subtle bg-surface">

                <th className="text-left px-5 py-4 text-xs uppercase">Data</th>
                <th className="text-left px-5 py-4 text-xs uppercase">Serviço</th>
                <th className="text-right px-5 py-4 text-xs uppercase">Valor</th>

              </tr>

            </thead>

            <tbody>

              {services.map((s,index)=>(

                <tr key={index} className="border-b border-border-subtle/50">

                  <td className="px-5 py-4 text-sm">
                    {new Date(s.servicedate).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {s.categorydescription}
                  </td>

                  <td className="px-5 py-4 text-sm text-right font-semibold">
                    {formatBRL(s.totalValue)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};

export default ClosureDetails;