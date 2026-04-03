import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/services/api";

interface Closure {
  closureid: string;
  closuremonthyear: string;
  closureclosed_at: string;
  closuretotalcalculated: number;
}

const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value);

const Closures = () => {

  const navigate = useNavigate();
  const [closures,setClosures] = useState<Closure[]>([]);
  const [loading,setLoading] = useState(true);

  const loadClosures = async () => {
    try{
      const res = await api.get("/closure");
      setClosures(res.data.closures?.closures || []);
    }catch(err){
      console.error(err);
      toast.error("Erro ao carregar fechamentos");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    loadClosures();
  },[]);

  const handleCloseMonth = async () => {

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth()-1);

    const monthYear = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth()+1).padStart(2,"0")}`;

    try{

      await api.post("/closure",{
        closuremonthyear: monthYear
      });

      toast.success("Mês fechado com sucesso");
      loadClosures();

    }catch(err:any){

      console.error(err);

      toast.error(
        err?.response?.data?.message ||
        "Erro ao fechar mês"
      );
    }
  };

  if(loading){
    return <div className="p-10">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="page-container animate-fade-in">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h1 className="section-title">Fechamentos</h1>
              <p className="text-muted-foreground text-sm">
                Histórico de faturamento mensal
              </p>
            </div>

          </div>

          <Button
            variant="action"
            size="lg"
            className="gap-2"
            onClick={handleCloseMonth}
          >
            <Lock className="w-4 h-4" />
            Fechar Mês
          </Button>

        </div>

        <div className="grid gap-4">

          {closures.map((closure)=>{

            const [year,month] = closure.closuremonthyear.split("-");

            return(

              <div
                key={closure.closureid}
                onClick={()=>navigate(`/closure-overview/${closure.closureid}`)}
                className="barber-card flex items-center justify-between cursor-pointer group"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {month}
                    </span>
                  </div>

                  <div>

                    <p className="font-semibold text-foreground">
                      {MONTH_NAMES[Number(month)-1]} {year}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Fechado em {new Date(closure.closureclosed_at).toLocaleDateString("pt-BR")}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <span className="text-lg font-bold text-primary">
                    {formatBRL(closure.closuretotalcalculated)}
                  </span>

                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary"/>

                </div>

              </div>

            )

          })}

        </div>

      </div>

    </div>
  );

};

export default Closures;