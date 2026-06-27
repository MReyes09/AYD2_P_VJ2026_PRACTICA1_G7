# controllers/analytics_controller.py
from flask import Blueprint, jsonify
from services.analytics_service import AnalyticsService

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")
_service = AnalyticsService()

@analytics_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """
    GET /api/analytics/dashboard
    Devuelve los datos agregados para las 4 gráficas del admin.
    """
    try:
        data = _service.obtener_analytics()
        return jsonify({"ok": True, "data": data}), 200
    except Exception as e:
        print(f"[analytics_controller] Error inesperado: {e}")
        return jsonify({"ok": False, "mensaje": "Error interno del servidor"}), 500