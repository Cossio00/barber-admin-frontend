import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, BarChart3, TrendingUp, FileDown, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { toast } from "sonner";

const formatBRL = (value:number)=>
 new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value);

const ClosureOverview = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [overview,setOverview] = useState<any>(null);

  useEffect(()=>{

    const loadOverview = async ()=>{

      try{

        const res = await api.get(`/closure-overview/${id}`);
        setOverview(res.data);

      }catch(err){

        console.error(err);
        toast.error("Erro ao carregar overview");

      }

    };

    loadOverview();

  },[id]);

  if(!overview) return <div className="p-10">Carregando...</div>;

  const stats = [

    {
      label:"Total do Mês",
      value:formatBRL(overview.filteredTotal || 0),
      icon:DollarSign,
      highlight:true
    },

    {
      label:"Serviços Realizados",
      value:String(overview.serviceCount || 0),
      icon:BarChart3
    },

    {
      label:"Ticket Médio",
      value:formatBRL(overview.average || 0),
      icon:TrendingUp
    }

  ];

  return (

    <div className="min-h-screen bg-background">

      <div className="page-container animate-fade-in">

        <Button
          variant="ghost"
          onClick={()=>navigate("/closures")}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4"/>
          Voltar
        </Button>

        <h1 className="section-title mb-8">
          Overview do Fechamento
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {stats.map((stat)=>{

            const Icon = stat.icon;

            return(

              <div key={stat.label} className="stat-card">

                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground"/>
                  <span className="text-xs text-muted-foreground uppercase">
                    {stat.label}
                  </span>
                </div>

                <span className="text-3xl font-bold">
                  {stat.value}
                </span>

              </div>

            )

          })}

        </div>

        <div className="flex gap-3">

          <Button
            variant="action"
            size="lg"
            onClick={()=>navigate(`/closure-details/${id}`)}
            className="gap-2"
          >
            <List className="w-4 h-4"/>
            Ver Serviços
          </Button>

          <Button variant="outline" size="lg" className="gap-2">
            <FileDown className="w-4 h-4"/>
            Gerar PDF
          </Button>

        </div>

      </div>

    </div>

  );

};

export default ClosureOverview;