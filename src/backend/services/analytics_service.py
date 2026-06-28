# services/analytics_service.py
from repositories.analytics_repository import AnalyticsRepository

class AnalyticsService:

    def __init__(self):
        self.repo = AnalyticsRepository()

    def obtener_analytics(self):
        """
        Agrega los datos de todas las gráficas en un solo objeto.
        Ante cualquier error en una gráfica individual, devuelve lista vacía
        para no romper las demás.
        """
        try:
            top_categorias = self.repo.get_top_categorias(limit=3)
        except Exception as e:
            print(f"[AnalyticsService] Error top_categorias: {e}")
            top_categorias = []

        try:
            top_niveles = self.repo.get_top_niveles(limit=3)
        except Exception as e:
            print(f"[AnalyticsService] Error top_niveles: {e}")
            top_niveles = []

        try:
            top_cursos = self.repo.get_top_cursos(limit=10)
        except Exception as e:
            print(f"[AnalyticsService] Error top_cursos: {e}")
            top_cursos = []

        try:
            suscripciones = self.repo.get_distribucion_suscripciones()
        except Exception as e:
            print(f"[AnalyticsService] Error suscripciones: {e}")
            suscripciones = []

        return {
            "topCategorias":    top_categorias,
            "topNiveles":       top_niveles,
            "topCursos":        top_cursos,
            "suscripciones":    suscripciones,
        }